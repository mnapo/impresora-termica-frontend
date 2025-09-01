import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { TouchableOpacity, View, Text, StyleSheet, FlatList } from 'react-native';
import {
  PaperProvider,
  Portal,
  Modal,
  Button, 
  TextInput,
  IconButton,
  SegmentedButtons,
  Divider,
  FAB,
  Chip,
  DataTable,
  Surface,
  Icon
} from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { productsActions } from '../../store/products';
import { clientsActions } from '../../store/clients';
import client from '../../feathersClient';
import ClientSelector from '../ClientSelector';
import ItemSelector from '../ItemSelector';

export default function NewInvoiceScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useLocalSearchParams();
  const [selectedType, setSelectedType] = useState(params.type);
  const products = useSelector((state: RootState) => state.products.items || []);
  const [quantity, setQuantity] = useState('');
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [clientId, setClientId] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const [page, setPage] = useState<number>(0);
  const [numberOfItemsPerPageList] = useState([8, 3, 4]);
  const [itemsPerPage, onItemsPerPageChange] = useState(numberOfItemsPerPageList[0]);
  const [visible, setVisible] = useState(false);
  const [maximized, setMaximized] = useState(true);
  const [pricesList, setPricesList] = useState('list1');
  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, items.length);
  const condIvaOptions = [
    { label: 'Responsable Inscripto', value: '1' },
    { label: 'Monotributo', value: '2' },
    { label: 'IVA Exento', value: '3' },
    { label: 'No inscripto en ARCA', value: '4' },
  ];

  const resetSelectedItem = () => {
    setSubtotal(0);
    setQuantity('1');
    setSelectedItem(null);
  };

  const showModal = () => {
    resetSelectedItem();
    setVisible(true);
  }
  const hideModal = () => setVisible(false);

  useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  useEffect(() => {
    dispatch(productsActions.fetchAction());
    dispatch(clientsActions.fetchAction());
  }, [dispatch]);

  useEffect(() => {
    const invoiceTotal = items.reduce((acc, it) => acc + (it.price || 0) * (it.quantity || 1), 0);
    setTotal(invoiceTotal);
  }, [items]);

  const handleItemSelect = (item: any) => {
    setSelectedItem(item);
    setQuantity('1');
    setSubtotal(item.price);
  };

  const addItem = () => {
    setItems(prevItems => {
      const existingIndex = prevItems.findIndex(item => item.code === selectedItem.code);

      if (existingIndex !== -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + (parseInt(quantity) || 1)
        };
        return updatedItems;
      } else {
        return [
          ...prevItems,
          { 
            productId: selectedItem.id,
            code: selectedItem.code,
            name: selectedItem.name,
            price: selectedItem.price,
            quantity: parseInt(quantity) || 1
          }
        ];
      }
    });
    resetSelectedItem();
  };

  const updateItemProduct = (index: number, productId: string) => {
    const product = products.find((p: any) => String(p.id) === String(productId));
    setItems(prev =>
      prev.map((item, i) =>
        i === index
          ? { ...item, productId, code: product?.code || '-', name: product?.name || '', price: product?.price || 0 }
          : item
      )
    );
  };

  const updateQuantity = (quantity: string) => {
    setQuantity(quantity);
    const subtotal = (parseFloat(quantity)*selectedItem.price).toFixed(2);
    setSubtotal(parseFloat(subtotal))
  }

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((i, _) => i.productId !== index));
  };

  const saveInvoice = async () => {
    try {
      let taxedOrSameTotal = total;
      if (selectedType == 'arca'){
        taxedOrSameTotal = taxedOrSameTotal + ((21*taxedOrSameTotal)/100);
      }
      const invoice = await client.service('invoices').create({
        type: selectedType,
        cuit: selectedClient.cuit,
        condIvaTypeId: selectedClient.condIvaTypeId,
        companyName: selectedClient.companyName,
        address: selectedClient.address,
        total: taxedOrSameTotal
      });

      for (const item of items) {
        await client.service('invoices-items').create({
          invoiceId: invoice.id,
          code: item.code,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        });
      }
      setQuantity('0')
      setSelectedClient(null);
      setItems([]);
      router.push({pathname: '/components/screens/InvoicesScreen' });
    } catch (error) {
      console.error('Error guardando factura:', error);
    }
  };

  return (<PaperProvider>{selectedType === 'arca'?(<Stack.Screen options={{ title: 'Nueva Factura' }}/>):(<Stack.Screen options={{ title: 'Nuevo Comprobante' }}/>)}
    <Portal>
      <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={maximized?styles.maximizedModal:styles.modal}>
        <Button onPress={()=>setMaximized(!maximized)}>{maximized?'▼ reducir':'▲ expandir'}</Button>
        <View style={{ height: '60%' }}>
          {selectedItem ? (
            <View style={{ height: '30%', paddingHorizontal: 16, marginTop: 5, alignItems: 'flex-start' }}>
              <Button icon="arrow-left" onPress={() => setSelectedItem(null)} textColor='lightseagreen' >Regresar</Button>
              <Text style={ styles.productTitle }>{selectedItem.name}</Text>
              <Divider />
              <Text style={ styles.productInfo } >Código: {selectedItem.code}</Text>
              <Text style={ styles.productInfo }>Precio: ${selectedItem.price}</Text>
              {(() => {
                const existing = items.find(item => item.code === selectedItem.code);
                if (existing) {
                  return (
                    <Text style={{ color: 'green', marginVertical: 4 }}>
                      Ya agregado: {existing.quantity} unidades
                    </Text>
                  );
                }
                return null;
              })()}
              <Divider />
              <View>
                  <TextInput
                    value={quantity}
                    onChangeText={updateQuantity}
                    label="Cantidad"
                    mode="outlined"
                    keyboardType="numeric"
                    style={{ width: '30%' }}
                  />
              </View>
              <Text style={ styles.productInfo } >Subtotal: ${subtotal || 0}</Text>
            </View>
          ) : (
            <View style={{ height: '100%' }}>
              <SegmentedButtons
                value={pricesList}
                style={{ marginBottom: 5 }}
                onValueChange={setPricesList}
                buttons={[
                  {
                    value: 'list1',
                    label: 'Lista #1',
                    style: { backgroundColor: pricesList === 'list1' ? 'black' : 'white' }, labelStyle: { color: pricesList === 'list1' ? 'white' : 'black' }
                  },
                  {
                    value: 'list2',
                    label: 'Lista #2',
                    style: { backgroundColor: pricesList === 'list2' ? 'black' : 'white' }, labelStyle: { color: pricesList === 'list2' ? 'white' : 'black' }
                  },
                  { 
                    value: 'list3',
                    label: 'Lista #3',
                    style: { backgroundColor: pricesList === 'list3' ? 'black' : 'white' }, labelStyle: { color: pricesList === 'list3' ? 'white' : 'black' }
                  },
                ]}
              />
              <ItemSelector onSelect={(item) => handleItemSelect(item)} pricesList={pricesList} invoiceType={selectedType} />
            </View>
          )}
        </View>
        <View style={{ marginTop: '10%' }}>
          <Button icon="plus" mode="contained" onPress={addItem} style={styles.addButton} disabled={!selectedItem} buttonColor='black' labelStyle={{ color: 'white' }} >
            Añadir a Factura
          </Button>
          <Divider style={{ marginVertical: 5 }}/>
          <Button icon="window-close" mode="outlined" onPress={hideModal} style={styles.addButton}>
            Cerrar
          </Button>
        </View>
      </Modal>
    </Portal>
    <View style={{ height:'100%', padding: 16 }}>
      <Surface elevation={2} style={{ paddingHorizontal: 2, maxHeight: '50%', overflow: 'hidden', backgroundColor: 'white' }}>
        {selectedClient ? (
          <View style={{ height: '30%', paddingHorizontal: 16 }}>
            <Text style={{ fontWeight: 'bold' }}>CUIT: {selectedClient.cuit}</Text>
            <Text>RAZÓN SOCIAL: {selectedClient.companyName}</Text>
            <Text>DIRECCIÓN: {selectedClient.address}</Text>
            <Text>CONDICIÓN IVA: {condIvaOptions.find(condIvaType => condIvaType.value === String(selectedClient.condIvaTypeId))?.label}</Text>
            <Button style={{left: 0}} icon="arrow-left" onPress={() => setSelectedClient(null)} textColor='lightseagreen' >Regresar</Button>
          </View>
        ) : (
          <View>
            <ClientSelector onSelect={(client) => setSelectedClient(client)} />
          </View>
        )}
      </Surface>

      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Código</DataTable.Title>
          <DataTable.Title>|Item</DataTable.Title>
          <DataTable.Title numeric>|Precio</DataTable.Title>
          <DataTable.Title numeric>|Cantidad</DataTable.Title>
          <DataTable.Title numeric>|Subtotal</DataTable.Title>
          <DataTable.Title numeric>|Borrar</DataTable.Title>
        </DataTable.Header>

        {items.slice(from, to).map((item) => (
          <DataTable.Row key={item.productId}>
            <DataTable.Cell style={{ flex: 0.1}}>{item.code}</DataTable.Cell>
            <DataTable.Cell style={{ flex: 0.3}}>{item.name}</DataTable.Cell>
            <DataTable.Cell style={{ flex: 0.2}}>${item.price}</DataTable.Cell>
            <DataTable.Cell style={{ flex: 0.1}}>x{item.quantity}</DataTable.Cell>
            <DataTable.Cell style={{ flex: 0.2}} numeric>${(item.price*item.quantity).toFixed(2)}</DataTable.Cell>
            <DataTable.Cell style={{ flex: 0.1}} numeric><IconButton icon="delete" size={20} onPress={() => removeItem(item.productId)} /></DataTable.Cell>
          </DataTable.Row>
        ))}

        <DataTable.Pagination
          page={page}
          numberOfPages={Math.ceil(items.length / itemsPerPage)}
          onPageChange={(page) => setPage(page)}
          label={`${from + 1}-${to} de ${items.length}`}
          numberOfItemsPerPageList={numberOfItemsPerPageList}
          numberOfItemsPerPage={itemsPerPage}
          showFastPaginationControls
          selectPageDropdownLabel={'Filas por pagina'}
        />
      </DataTable>
      {
        items.length>0?
        (
          <>
          {selectedType==='arca'?
          (<>
            <Chip disabled={true} elevated={false} textStyle={{fontSize: 18}} style={{position: 'absolute', bottom: '12%', left: '2%'}}>Total S/ IVA: ${total || 0}</Chip>
            <Chip disabled={true} elevated={false} textStyle={{fontSize: 18}} style={{position: 'absolute', bottom: '7%', left: '2%'}}>IVA 21%: ${((21*total)/100).toFixed(2) || 0}</Chip>
            <Chip icon="information" elevated={true} textStyle={{ fontSize: 18, color: 'white' }} style={{ position: 'absolute', backgroundColor: 'black', bottom: '2%', left: '2%' }}>Total: ${(total+((21*total)/100)).toFixed(2) || 0}</Chip>
          </>)
            :(<Chip icon="information" elevated={true} textStyle={{ fontSize: 18, color: 'white' }} style={{ position: 'absolute', backgroundColor: 'black', bottom: '2%', left: '2%' }}>Total: ${total.toFixed(2) || 0}</Chip>)
          }
          </>
        ):(<Chip icon="information" textStyle={{fontSize: 18}} style={{position: 'absolute', bottom: '2%', left: '2%'}}>Ningún item añadido</Chip>)
      }
      <FAB
        icon="plus"
        label="ITEM"
        color="white"
        style={{ position: 'absolute', backgroundColor: `${!selectedClient?'grey':'black'}`, bottom: '10%', right: '6%' }}
        onPress={showModal}
        disabled={!selectedClient}
      />
      <FAB
        icon="content-save"
        label="Guardar"
        color="white"
        style={{position: 'absolute', backgroundColor: `${(!selectedClient || items.length === 0)?'grey':'green'}`, bottom: '2%', right: '6%'}}
        onPress={saveInvoice}
        disabled={!selectedClient || items.length === 0}
      />
    </View>
  </PaperProvider>);
}

const styles = StyleSheet.create({
  container: { flex: 1,
    padding: 10,
    backgroundColor: 'white',
  },
  label: { fontWeight: 'bold', marginBottom: 5, left: '50%' },
  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  inputSmall: { width: 80, marginHorizontal: 5 },
  quantityRow: { flexDirection: 'row', alignItems: 'center' },
  addButton: { marginTop: 5 },
  maximizedModal: {backgroundColor: 'white', padding: 5, height: '100%', justifyContent: 'flex-start' },
  modal: {backgroundColor: 'white', padding: 5, maxHeight: '70%'},
  productTitle: { fontSize: 24, fontWeight: 'bold', marginVertical: 2, textAlign: 'center' },
  productInfo: { fontSize: 14, marginVertical: 2, textAlign: 'center' }
});