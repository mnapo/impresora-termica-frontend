import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Portal, Modal, TextInput, Button, Card, IconButton, FAB, PaperProvider, SegmentedButtons, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { Stack } from 'expo-router';
import { productsActions } from '../../store/products';

export default function ProductsScreen() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state: any) => state.products);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [pricesList, setPricesList] = useState('list1');
  const [price1, setPrice1] = useState('');
  const [price2, setPrice2] = useState('');
  const [price3, setPrice3] = useState('');

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
  };

  const handleSave = () => {
    const payload = {
      code,
      name,
      price1: parseFloat(price1),
      price2: parseFloat(price2),
      price3: parseFloat(price3),
    };

    if (selectedProduct) {
      dispatch(productsActions.updateAction({ ...selectedProduct, ...payload }));
    } else {
      dispatch(productsActions.createAction(payload));
    }
    setModalVisible(false);
  };

  const totalPages = Math.ceil(items.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedItems = items.slice(startIndex, endIndex);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [items]);

  return (
    <PaperProvider>
      <Stack.Screen options={{ title: 'Productos' }} />

      <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modal}>
          <View style={{ flex: 1, padding: 16 }}>
            <TextInput label="Código" value={code} onChangeText={setCode} style={{ marginBottom: 8 }} />
            <TextInput label="Descripción" value={name} onChangeText={setName} style={{ marginBottom: 8 }} />
            <TextInput label="Precio de Lista #1" value={price1} onChangeText={setPrice1} keyboardType="numeric" style={{ marginBottom: 8 }} />
            <TextInput label="Precio de Lista #2" value={price2} onChangeText={setPrice2} keyboardType="numeric" style={{ marginBottom: 8 }} />
            <TextInput label="Precio de Lista #3" value={price3} onChangeText={setPrice3} keyboardType="numeric" style={{ marginBottom: 8 }} />
            <Button
              mode="contained"
              onPress={handleSave}
              icon={selectedProduct ? 'pencil' : 'plus'}
              disabled={!code || !name || !price1}
            >
              {selectedProduct ? 'Guardar producto' : 'Añadir producto'}
            </Button>
          </View>
        </Modal>
      </Portal>

      <View style={{ flex: 1 }}>
        <SegmentedButtons
          value={pricesList}
          style={{ marginBottom: 5 }}
          onValueChange={setPricesList}
          buttons={[
            { value: 'list1', label: 'Lista #1' },
            { value: 'list2', label: 'Lista #2' },
            { value: 'list3', label: 'Lista #3' },
          ]}
        />
        <View style={styles.paginationContainer}>
          <Button
            mode="outlined"
            disabled={currentPage === 1}
            onPress={() => setCurrentPage((prev) => prev - 1)}
          >
            Anterior
          </Button>
          <Text style={{ marginHorizontal: 8 }}>
            Página {currentPage} de {totalPages || 1}
          </Text>
          <Button
            mode="outlined"
            disabled={currentPage === totalPages || totalPages === 0}
            onPress={() => setCurrentPage((prev) => prev + 1)}
          >
            Siguiente
          </Button>
        </View>
        <FlatList
          data={paginatedItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={{ marginTop: 12 }}>
              <Card.Title
                title={`(${item.code}) ${item.name}`}
                subtitle={`$${pricesList === 'list1' ? item.price1 : pricesList === 'list2' ? item.price2 : item.price3}`}
              />
              <Card.Actions>
                <IconButton icon="pencil" onPress={() => handleEdit(item)} />
                <IconButton icon="delete" onPress={() => handleDelete(item.id)} />
              </Card.Actions>
            </Card>
          )}
        />

        <FAB
          icon="plus"
          label="NUEVO"
          onPress={handleAdd}
          style={{ position: 'absolute', bottom: '5%', left: '62%' }}
        />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  modal: { backgroundColor: 'white', padding: 20 },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
});
