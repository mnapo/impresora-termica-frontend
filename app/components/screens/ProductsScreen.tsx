import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ScrollView } from 'react-native';
import {
  PaperProvider,
  Portal,
  Modal,
  DataTable,
  TextInput,
  Searchbar,
  Button,
  IconButton,
  FAB,
  SegmentedButtons,
  Text,
  Divider
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { Stack } from 'expo-router';
import ActionNotification from '../ActionNotification';
import DeleteConfirmation from '../DeleteConfirmation';
import { productsActions } from '../../store/products';

export default function ProductsScreen() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state: any) => state.products);

  const [page, setPage] = useState(0);
  const itemsPerPage = 1000;
  const [sortDirection, setSortDirection] = useState<'ascending' | 'descending'>('ascending');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [pricesList, setPricesList] = useState('list1');
  const [price1, setPrice1] = useState('');
  const [price2, setPrice2] = useState('');
  const [price3, setPrice3] = useState('');
  const [successfulAdditionNotificationVisible, setSuccessfulAdditionNotificationVisible] = useState(false);
  const [successfulEditionNotificationVisible, setSuccessfulEditionNotificationVisible] = useState(false);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [productToDeleteId, setProductToDeleteId] = useState('');
  const filteredItems = items.filter((item: any) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.code.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortDirection === 'ascending') {
      return a.code.localeCompare(b.code);
    } else {
      return b.code.localeCompare(a.code);
    }
  });

  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  const paginatedItems = sortedItems.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  useEffect(() => {
    dispatch(productsActions.fetchAction({ paginate: false }));
  }, []);

  const handleAdd = () => {
    setSelectedProduct(null);
    setCode('');
    setName('');
    setPrice1('');
    setPrice2('');
    setPrice3('');
    setModalVisible(true);
  };

  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setCode(product.code);
    setName(product.name);
    setPrice1(String(product.price1));
    setPrice2(String(product.price2));
    setPrice3(String(product.price3));
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    dispatch(productsActions.removeAction(id));
    setDeleteConfirmationVisible(false);
  };

  const handleSave = () => {
    const priceTwo = price2 || '0'
    const priceThree = price3 || '0'
    const payload = {
      code,
      name,
      price1: parseFloat(price1),
      price2: parseFloat(priceTwo),
      price3: parseFloat(priceThree),
    };
    if (selectedProduct) {
      dispatch(productsActions.updateAction({ id: selectedProduct.id, ...payload }));
      setSuccessfulEditionNotificationVisible(true);
    } else {
      dispatch(productsActions.createAction(payload));
      setSuccessfulAdditionNotificationVisible(true);
    }
    setModalVisible(false);
  };

  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(0);
    }
  }, [items]);

  return (
    <PaperProvider>
      <Stack.Screen options={{ title: 'Productos' }} />

      <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modal}>
          <View style={{ flex: 1, padding: 16 }}>
            <TextInput label="Código" value={code} onChangeText={setCode} style={ styles.input } activeUnderlineColor='#429E9D' />
            <TextInput label="Descripción" value={name} onChangeText={setName} style={ styles.input } activeUnderlineColor='#429E9D' />
            <TextInput label="Precio de Lista #1" value={price1} onChangeText={setPrice1} keyboardType="numeric" style={ styles.input } activeUnderlineColor='#429E9D' />
            <TextInput label="Precio de Lista #2 (opcional)" value={price2} onChangeText={setPrice2} keyboardType="numeric" style={ styles.input } activeUnderlineColor='#429E9D' />
            <TextInput label="Precio de Lista #3 (opcional)" value={price3} onChangeText={setPrice3} keyboardType="numeric" style={ styles.input } activeUnderlineColor='#429E9D' />
            <Button
              mode="contained"
              onPress={handleSave}
              icon={selectedProduct ? 'pencil' : 'plus'}
              disabled={!code || !name || !price1}
              style={ styles.button }
            >
              {selectedProduct ? 'Guardar producto' : 'Añadir producto'}
            </Button>
          </View>
        </Modal>
      </Portal>

      <View style={{ flex: 1, backgroundColor: 'white', height: '100%' }}>
        <SegmentedButtons
          value={pricesList}
          style={{ marginBottom: 5 }}
          onValueChange={setPricesList}
          buttons={[
            {
              value: 'list1',
              label: 'Lista #1',
              style: { backgroundColor: pricesList === 'list1' ? '#429E9D' : 'white' }, labelStyle: { color: pricesList === 'list1' ? 'white' : 'black' }
            },
            {
              value: 'list2',
              label: 'Lista #2',
              style: { backgroundColor: pricesList === 'list2' ? '#429E9D' : 'white' }, labelStyle: { color: pricesList === 'list2' ? 'white' : 'black' }
            },
            { 
              value: 'list3',
              label: 'Lista #3',
              style: { backgroundColor: pricesList === 'list3' ? '#429E9D' : 'white' }, labelStyle: { color: pricesList === 'list3' ? 'white' : 'black' }
            },
          ]}
        />
        <Searchbar
          placeholder="Buscar producto..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{ marginBottom: 8, marginTop: 8, backgroundColor: 'white', borderColor: 'lightgray', borderWidth: 1, marginHorizontal: 16 }}
        />
        <View style={{ height: '75%'}} >
          <ScrollView>
            <DataTable>
              <DataTable.Header style={{ borderWidth: 0, backgroundColor: 'white' }}>
                <DataTable.Title sortDirection={sortDirection} onPress={() => setSortDirection(sortDirection === 'ascending' ? 'descending' : 'ascending')} style={{ flex: 0.6, minWidth: 0, justifyContent: 'flex-start' }}>Cod.</DataTable.Title>
                <DataTable.Title style={{ flex: 1, minWidth: 0, justifyContent: 'flex-start' }}>Descripción</DataTable.Title>
                <DataTable.Title style={{ flex: 1, minWidth: 0, justifyContent: 'center', alignItems: 'center' }}>Precio</DataTable.Title>
                <DataTable.Title style={{ flex: 1, minWidth: 0, justifyContent: 'flex-end', alignItems: 'center' }}>Acciones</DataTable.Title>
              </DataTable.Header>
              {paginatedItems.map((item: any, idx: number) => (
                <React.Fragment key={item.id}>
                  <DataTable.Row style={{ borderWidth: 0, backgroundColor: 'white' }}>
                    <DataTable.Cell style={{ flex: 0.6, minWidth: 0 }}>
                      <Text variant="bodyMedium">{item.code}</Text>
                    </DataTable.Cell>
                    <DataTable.Cell style={{ flex: 1, minWidth: 0 }}>
                      <Text variant="bodyMedium">{item.name}</Text>
                    </DataTable.Cell>
                    <DataTable.Cell style={{ flex: 1, minWidth: 0, alignItems: 'center', justifyContent: 'center' }}>
                      <Text variant="bodyMedium" style={{ textAlign: 'right' }}>
                        ${pricesList === 'list1' ? item.price1 : pricesList === 'list2' ? item.price2 : item.price3}
                      </Text>
                    </DataTable.Cell>
                    <DataTable.Cell style={{ flex: 1, minWidth: 0 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <IconButton
                          icon="pencil"
                          size={24}
                          style={{ backgroundColor: '#429E9D', marginRight: 8 }}
                          iconColor="white"
                          onPress={() => handleEdit(item)}
                        />
                        <IconButton
                          icon="delete"
                          size={24}
                          style={{ backgroundColor: 'red' }}
                          iconColor="white"
                          onPress={() => { setCode(item.code); setProductToDeleteId(item.id); setDeleteConfirmationVisible(true) } }
                        />
                      </View>
                    </DataTable.Cell>
                  </DataTable.Row>
                  {idx < paginatedItems.length - 1 && (
                    <Divider style={{ height: 1, backgroundColor: '#eee', marginHorizontal: 8 }} />
                  )}
                </React.Fragment>
              ))}
            </DataTable>
          </ScrollView>
        </View>
        <View style={{ height: '25%', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 }}>
          <Text variant="bodyMedium" style={{ marginBottom: 120 }}>
            {items.length} productos añadidos
          </Text>
        </View>
        <FAB
          icon="plus"
          label=""
          color="white"
          onPress={handleAdd}
          style={{ position: 'absolute', bottom: '2%', right: '10%', backgroundColor: '#429E9D' }}
        />
      </View>
      <ActionNotification type="success" source="products" target={`#${code}`} action="add" onDismiss={ ()=> {setSuccessfulAdditionNotificationVisible(false)} } visible={successfulAdditionNotificationVisible} />
      <ActionNotification type="success" source="products" target={`#${code}`} action="update" onDismiss={ ()=> {setSuccessfulEditionNotificationVisible(false)} } visible={successfulEditionNotificationVisible} />
      <DeleteConfirmation source="products" target={`#${code}`} onConfirm={ ()=> {handleDelete(productToDeleteId)} } onDismiss={ ()=> { setDeleteConfirmationVisible(false); setCode(''), setProductToDeleteId('') } } visible={deleteConfirmationVisible} />
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  modal: { backgroundColor: 'white', padding: 20 },
  input: { marginBottom: 8, backgroundColor: 'white' },
  button: { marginTop: 16, backgroundColor: '#429E9D' }
});
