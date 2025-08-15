import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { TextInput, Button, Card, IconButton, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { clientsActions } from '../../store/clients';

export default function ClientsScreen() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state: any) => state.clients);

  const [cuit, setCuit] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [condIvaType, setCondIvaType] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    dispatch(clientsActions.fetchAction());
  }, []);

  const handleAdd = () => {
    if (!companyName || !condIvaType || !cuit || !address) return;
    dispatch(clientsActions.createAction({ cuit, companyName, condIvaType, address }));
    setCuit('');
    setCompanyName(''); 
    setCondIvaType('');
    setAddress('');
  };

  const handleDelete = (id: string) => {
    dispatch(clientsActions.removeAction(id));
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput
        label="CUIT"
        value={cuit}
        onChangeText={setCuit}
        keyboardType="numeric"
        style={{ marginBottom: 8 }}
      />
      <TextInput
        label="Razón Social"
        value={companyName}
        onChangeText={setCompanyName}
        style={{ marginBottom: 8 }}
      />
      <TextInput
        label="Condición IVA"
        value={condIvaType}
        onChangeText={setCondIvaType}
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
            <Card.Title title={`${item.address}`} subtitle={`${item.companyName} | ${item.cuit}`} />
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