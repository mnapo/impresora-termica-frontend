import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { TextInput, Button, Card, IconButton, Text, FAB, PaperProvider, Portal, Modal } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { productsActions } from '../../store/products';

export default function ProductsScreen() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state: any) => state.products);

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  useEffect(() => {
    dispatch(productsActions.fetchAction());
  }, []);

  const handleAdd = () => {
    if (!code || !name || !price) return;
    dispatch(productsActions.createAction({ code, name, price: parseFloat(price) }));
    setCode('');
    setName('');
    setPrice('');
    hideModal();
  };

  const handleDelete = (id: string) => {
    dispatch(productsActions.removeAction(id));
  };

  return (
    <PaperProvider>
      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modal}>
          <View style={{ flex: 1, padding: 16 }}>
            <TextInput
              label="Código"
              value={code}
              onChangeText={setCode}
              style={{ marginBottom: 8 }}
            />
            <TextInput
              label="Descripción"
              value={name}
              onChangeText={setName}
              style={{ marginBottom: 8 }}
            />
            <TextInput
              label="Precio"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              style={{ marginBottom: 8 }}
            />
            <Button mode="contained" onPress={handleAdd} icon='plus' disabled={!code || !name || !price}>
              Agregar Producto
            </Button>
          </View>
        </Modal>
      </Portal>
      <View style={{ height: '100%' }}>
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={{ marginTop: 12 }}>
              <Card.Title title={`(${item.code}) ${item.name}`} subtitle={`$${item.price}`} />
              <Card.Actions>
                <IconButton
                  icon="delete"
                  onPress={() => handleDelete(item.id)}
                />
              </Card.Actions>
            </Card>
          )}
        />
        <FAB
          icon="plus"
          label="NUEVO"
          onPress={showModal}
          style={{position: 'absolute', bottom: '5%', left: '62%'}}
        />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  modal: {backgroundColor: 'white', padding: 20},
});