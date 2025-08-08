import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { TextInput, Button, Card, IconButton, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { productsActions } from '../../store/products';

export default function ProductsScreen() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state: any) => state.products);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    dispatch(productsActions.fetchAction());
  }, []);

  const handleAdd = () => {
    if (!name || !price) return;
    dispatch(productsActions.createAction({ name, price: parseFloat(price) }));
    setName('');
    setPrice('');
  };

  const handleDelete = (id: string) => {
    dispatch(productsActions.removeAction(id));
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput
        label="Nombre"
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
      <Button mode="contained" onPress={handleAdd}>
        Agregar Producto
      </Button>

      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Card style={{ marginTop: 12 }}>
            <Card.Title title={item.name} subtitle={`$${item.price}`} />
            <Card.Actions>
              <IconButton
                icon="delete"
                onPress={() => handleDelete(item._id)}
              />
            </Card.Actions>
          </Card>
        )}
      />
    </View>
  );
}