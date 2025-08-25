import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Portal, Modal, TextInput, Button, Card, IconButton, FAB, PaperProvider, SegmentedButtons } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { Stack } from 'expo-router';
import { productsActions } from '../../store/products';

export default function ProductsScreen() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state: any) => state.products);

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [pricesList, setPricesList] = useState('list1');
  const [price1, setPrice1] = useState('');
  const [price2, setPrice2] = useState('');
  const [price3, setPrice3] = useState('');
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  useEffect(() => {
    dispatch(productsActions.fetchAction());
  }, []);

  const handleAdd = () => {
    if (!code || !name || !price1) return;
    dispatch(productsActions.createAction({ code, name, price1: parseFloat(price1), price2: parseFloat(price2), price3: parseFloat(price3) }));
    setCode('');
    setName('');
    setPrice1('');
    setPrice2('');
    setPrice3('');
  };

  const handleDelete = (id: string) => {
    dispatch(productsActions.removeAction(id));
  };

  return (
    <PaperProvider>
      <Stack.Screen options={{ title: 'Productos' }}/>
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
              label="Precio de Lista #1"
              value={price1}
              onChangeText={setPrice1}
              keyboardType="numeric"
              style={{ marginBottom: 8 }}
            />
            <TextInput
              label="Precio de Lista #2"
              value={price2}
              onChangeText={setPrice2}
              keyboardType="numeric"
              style={{ marginBottom: 8 }}
            />
            <TextInput
              label="Precio de Lista #3"
              value={price3}
              onChangeText={setPrice3}
              keyboardType="numeric"
              style={{ marginBottom: 8 }}
            />
            <Button mode="contained" onPress={handleAdd} icon='plus' disabled={!code || !name || !price1}>
              Agregar Producto
            </Button>
          </View>
        </Modal>
      </Portal>
      <View style={{ height: '100%' }}>
        <SegmentedButtons
          value={pricesList}
          style={{ marginBottom: 5 }}
          onValueChange={setPricesList}
          buttons={[
            {
              value: 'list1',
              label: 'Lista #1',
            },
            {
              value: 'list2',
              label: 'Lista #2',
            },
            { 
              value: 'list3',
              label: 'Lista #3'
            },
          ]}
        />
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={{ marginTop: 12 }}>
              <Card.Title
                title={`(${item.code}) ${item.name}`}
                subtitle={`$${pricesList==='list1'?item.price1:pricesList==='list2'?item.price2:item.price3}`}/>
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