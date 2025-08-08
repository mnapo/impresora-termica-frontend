import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { TextInput, Button, Card, IconButton, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { clientsActions } from '../../store/clients';

export default function ClientsScreen() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state: any) => state.clients);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [cuit, setCuit] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    dispatch(clientsActions.fetchAction());
  }, []);

  const handleAdd = () => {
    if (!firstName || !lastName || !cuit || !address) return;
    dispatch(clientsActions.createAction({ firstName, lastName, cuit, address }));
    setFirstName('');
    setLastName(''); 
    setCuit('');
    setAddress('');
  };

  const handleDelete = (id: string) => {
    dispatch(clientsActions.removeAction(id));
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput
        label="Nombre"
        value={firstName}
        onChangeText={setFirstName}
        style={{ marginBottom: 8 }}
      />
      <TextInput
        label="Apellido"
        value={lastName}
        onChangeText={setLastName}
        style={{ marginBottom: 8 }}
      />
      <TextInput
        label="CUIT"
        value={cuit}
        onChangeText={setCuit}
        keyboardType="numeric"
        style={{ marginBottom: 8 }}
      />
      <TextInput
        label="Dirección"
        value={address}
        onChangeText={setAddress}
        style={{ marginBottom: 8 }}
      />
      <Button mode="contained" onPress={handleAdd}>
        Agregar Cliente
      </Button>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={{ marginTop: 12 }}>
            <Card.Title title={`${item.firstName} ${item.lastName}`} subtitle={`$${item.address}`} />
            <Card.Actions>
              <IconButton
                icon="delete"
                onPress={() => handleDelete(item.id)}
              />
            </Card.Actions>
          </Card>
        )}
      />
    </View>
  );
}