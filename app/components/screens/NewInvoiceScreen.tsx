import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, Stack } from "expo-router";
import { View, Text, StyleSheet, FlatList } from 'react-native';
import {
  Button, 
  TextInput,
  IconButton,
  Divider,
  FAB,
  SegmentedButtons,
  Chip,
  DataTable,
  Modal,
  Portal,
  PaperProvider,
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

export default function NewInvoiceScreen({ navigation }: any) {
  const dispatch = useDispatch();
  const params = useLocalSearchParams();
  const selectedType = params.type;
  const products = useSelector((state: RootState) => state.products.items || []);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [clientId, setClientId] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const [pricesList, setPricesList] = React.useState('list1');

  const [page, setPage] = React.useState<number>(0);
  const [numberOfItemsPerPageList] = React.useState([8, 3, 4]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
  );

  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, items.length);

  useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  useEffect(() => {
    dispatch(productsActions.fetchAction());
    dispatch(clientsActions.fetchAction());
  }, [dispatch]);

  const addItem = () => {
    setItems([...items, { productId: selectedItem.id, name: selectedItem.name, price: selectedItem.price, quantity: 1 }]);
    setSelectedItem(null);
  };

  const updateItemProduct = (index: number, productId: string) => {
    const product = products.find((p: any) => String(p.id) === String(productId));
    setItems(prev =>
      prev.map((item, i) =>
        i === index
          ? { ...item, productId, name: product?.name || '', price: product?.price || 0 }
          : item
      )
    );
  };

  const updateQuantity = (index: number, delta: number) => {
    setItems(prev =>
      prev.map((item, i) =>
        i === index
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (index: number) => {
    
    setItems(prev => prev.filter((i, _) => i.productId !== index));
  };

  const saveInvoice = async () => {
    try {
      const invoice = await client.service('invoices').create({
        type: selectedType,
        address: clientId,
        subtotal: 0,
        total: 0
      });

      for (const item of items) {
        await client.service('invoices-items').create({
          invoiceId: invoice.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        });
      }

      console.log('Factura y items guardados correctamente');
      navigation.goBack();
    } catch (error) {
      console.error('Error guardando factura:', error);
    }
  };

  return (<PaperProvider>{selectedType === 'arca'?(<Stack.Screen options={{ title: 'Nueva Factura' }}/>):(<Stack.Screen options={{ title: 'Nuevo Comprobante' }}/>)}
    <Portal>
      <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modal}>
        <SegmentedButtons
          value={pricesList}
          style={{ marginBottom: 5 }}
          onValueChange={setPricesList}
          buttons={[
            {
              value: 'list1',
              label: 'Lista 1',
            },
            {
              value: 'list2',
              label: 'Lista 2',
            },
            { 
              value: 'list3',
              label: 'Lista 3'
            },
          ]}
        />
        <View style={{ maxHeight: '60%', overflow: 'hidden' }}>
          {selectedItem ? (
            <View style={{ height: '30%', paddingHorizontal: 16, marginTop: 5, alignItems: 'center' }}>
              <Text style={{ fontWeight: 'bold' }}>Descripción: {selectedItem.name}</Text>
              <Text>Precio: ${selectedItem.price}</Text>
              <TextInput
                label="Cantidad"
                mode="outlined"
                keyboardType="numeric"
                style={{ width: '30%' }}
              />
              <Chip icon="information">Total: $0</Chip>
              <Button icon="magnify" onPress={() => setSelectedItem(null)}>BUSCAR OTRO PRODUCTO</Button>
            </View>
          ) : (
            <View style={{ }}>
              <ItemSelector onSelect={(item) => setSelectedItem(item)} />
            </View>
          )}
        </View>
        <Button icon="plus" mode="outlined" onPress={addItem} style={styles.addButton} disabled={!selectedItem}>
          Añadir a Factura
        </Button>
        <Button icon="window-close" mode="contained" onPress={hideModal} style={styles.addButton}>
          Cerrar
        </Button>
      </Modal>
    </Portal>
    <View style={{ height:'100%', padding: 16 }}>
      <Surface elevation={4} style={{ paddingHorizontal: 16, maxHeight: '50%', overflow: 'hidden' }}>
        {selectedClient ? (
          <View style={{ height: '30%', paddingHorizontal: 16 }}>
            <Text style={{ fontWeight: 'bold' }}>CUIT: {selectedClient.cuit}</Text>
            <Text>RAZÓN SOCIAL: {selectedClient.companyName}</Text>
            <Text>DIRECCIÓN: {selectedClient.address}</Text>
            <Text>CONDICIÓN FRENTE AL IVA: {selectedClient.condIvaType}</Text>
            <Button style={{left: 0}} icon="magnify" onPress={() => setSelectedClient(null)}>BUSCAR OTRO CLIENTE</Button>
          </View>
        ) : (
          <View style={{ }}>
            <ClientSelector onSelect={(client) => setSelectedClient(client)} />
          </View>
        )}
      </Surface>

      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Item</DataTable.Title>
          <DataTable.Title numeric>Precio</DataTable.Title>
          <DataTable.Title numeric>Cantidad</DataTable.Title>
          <DataTable.Title numeric>Eliminar</DataTable.Title>
        </DataTable.Header>

        {items.slice(from, to).map((item) => (
          <DataTable.Row key={item.productId}>
            <DataTable.Cell>{item.name}</DataTable.Cell>
            <DataTable.Cell numeric>${item.price}</DataTable.Cell>
            <DataTable.Cell numeric>{item.quantity}</DataTable.Cell>
            <DataTable.Cell numeric><IconButton icon="delete" size={20} onPress={() => removeItem(item.productId)} /></DataTable.Cell>
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
      <Chip icon="information" textStyle={{fontSize: 16}} style={{position: 'absolute', bottom: '2%', left: '2%'}}>Total: $0</Chip>
      <FAB
        icon="plus"
        label="ITEM"
        style={{position: 'absolute', bottom: '10%', left: '62%'}}
        onPress={showModal}
        disabled={!selectedClient}
      />
      <FAB
        icon="content-save"
        label="Guardar"
        style={{position: 'absolute', bottom: '2%', left: '62%'}}
        onPress={saveInvoice}
        disabled={!selectedClient || items.length === 0}
      />
    </View>
  </PaperProvider>);
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  label: { fontWeight: 'bold', marginBottom: 5, left: '50%' },
  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  inputSmall: { width: 80, marginHorizontal: 5 },
  quantityRow: { flexDirection: 'row', alignItems: 'center' },
  addButton: { marginTop: 5 },
  saveButton: { marginTop: 20 },
  modal: {backgroundColor: 'white', padding: 20}
});