import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { TextInput, Button, Card, IconButton, Text, FAB, PaperProvider, Portal, Modal } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { clientsActions } from '../../store/clients';

export default function ClientsScreen() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state: any) => state.clients);

  const [cuit, setCuit] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [condIvaType, setCondIvaType] = useState('');
  const [address, setAddress] = useState('');

  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

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
    hideModal();
  };

  const handleDelete = (id: string) => {
    dispatch(clientsActions.removeAction(id));
  };

  return (
    <PaperProvider>
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
              <Button mode="contained" onPress={handleAdd} icon='plus' disabled={!cuit || !companyName || !condIvaType || !address}>
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
                subtitle={`DIRECCIÓN: ${item.companyName} | CONDICIÓN IVA: ${item.condIvaType}`}
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