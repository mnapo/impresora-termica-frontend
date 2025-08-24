import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { TextInput, Button, Card, IconButton, Text, FAB, PaperProvider, Portal, Modal } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { Stack } from 'expo-router';
import { clientsActions } from '../../store/clients';
import { Dropdown } from 'react-native-paper-dropdown';

export default function ClientsScreen() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state: any) => state.clients);

  const [cuit, setCuit] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [condIvaTypeId, setCondIvaTypeId] = useState<string>();
  const [address, setAddress] = useState('');

  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const NON_REGISTERED_CONDIVATYPE_ID = 4;
  const condIvaOptions = [
    { label: 'Responsable Inscripto', value: '1' },
    { label: 'Monotributo', value: '2' },
    { label: 'IVA Exento', value: '3' },
    { label: 'No inscripto en ARCA', value: '4' },
  ];

  useEffect(() => {
    dispatch(clientsActions.fetchAction());
  }, []);

  const handleAdd = () => {
    if (!companyName || !condIvaTypeId || !cuit || !address) return;
    dispatch(clientsActions.createAction({ cuit, companyName, condIvaTypeId: parseInt(condIvaTypeId) || NON_REGISTERED_CONDIVATYPE_ID, address }));
    setCuit('');
    setCompanyName(''); 
    setCondIvaTypeId('');
    setAddress('');
    hideModal();
  };

  const handleDelete = (id: string) => {
    dispatch(clientsActions.removeAction(id));
  };

  return (
    <PaperProvider>
      <Stack.Screen options={{ title: 'Clientes' }}/>
      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modal}>
          <View style={{ height: '100%', flex: 1, padding: 16 }}>
            <TextInput
              label="CUIT"
              value={cuit}
              onChangeText={setCuit}
              keyboardType="numeric"
              style={{ marginBottom: 8 }}
            />
            <Dropdown
              label="Condición frente al IVA"
              placeholder="Seleccionar"
              options={condIvaOptions}
              value={condIvaTypeId}
              onSelect={setCondIvaTypeId}
            />
            <TextInput
              label="Razón Social"
              value={companyName}
              onChangeText={setCompanyName}
              style={{ marginBottom: 8 }}
            />
            <TextInput
              label="Dirección"
              value={address}
              onChangeText={setAddress}
              style={{ marginBottom: 8 }}
            />
            <Button mode="contained" onPress={handleAdd} icon='plus' disabled={!cuit || !companyName || !condIvaTypeId || !address}>
              Agregar Cliente
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
              <Card.Title
                title={`CUIT: ${item.cuit} | RAZÓN SOCIAL: ${item.companyName}`}
                subtitle={`DIRECCIÓN: ${item.companyName} | CONDICIÓN IVA: ${condIvaOptions.find(condIvaType => condIvaType.value === String(item.condIvaTypeId))?.label}`}
              />
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