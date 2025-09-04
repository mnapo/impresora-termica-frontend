import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  PaperProvider,
  Portal,
  Modal,
  FAB,
  TextInput,
  Button,
  IconButton,
  Searchbar,
  Text,
  DataTable,
  Divider
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { Stack } from 'expo-router';
import ActionNotification from '../ActionNotification';
import DeleteConfirmation from '../DeleteConfirmation';
import { clientsActions } from '../../store/clients';
import { Dropdown } from 'react-native-paper-dropdown';

export default function ClientsScreen() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state: any) => state.clients);

  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [cuit, setCuit] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [condIvaTypeId, setCondIvaTypeId] = useState<string>();
  const [address, setAddress] = useState('');
  const [visible, setVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const itemsPerPage = 1000;
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [successfulAdditionNotificationVisible, setSuccessfulAdditionNotificationVisible] = useState(false);
  const [successfulEditionNotificationVisible, setSuccessfulEditionNotificationVisible] = useState(false);
  const [successfulDeletionNotificationVisible, setSuccessfulDeletionNotificationVisible] = useState(false);
  const [clientToDeleteId, setClientToDeleteId] = useState('');
  const NON_REGISTERED_CONDIVATYPE_ID = 4;
  const condIvaOptions = [
    { label: 'Responsable Inscripto', value: '1' },
    { label: 'Monotributo', value: '2' },
    { label: 'IVA Exento', value: '3' },
    { label: 'No inscripto en ARCA', value: '4' },
  ];

  const showModal = () => setVisible(true);
  const hideModal = () => {
    setVisible(false);
    setSelectedClient(null);
    setCuit('');
    setCompanyName('');
    setCondIvaTypeId('');
    setAddress('');
  };

  const filteredItems = items.filter((item: any) =>
    item.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.cuit.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.address.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  useEffect(() => {
    dispatch(clientsActions.fetchAction({ paginate: false }));
  }, []);

  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(0);
    }
  }, [items, totalPages, page]);

  const handleSave = () => {
    if (!companyName || !condIvaTypeId || !cuit || !address) return;
    const payload = {
      cuit,
      companyName,
      condIvaTypeId: parseInt(condIvaTypeId) || NON_REGISTERED_CONDIVATYPE_ID,
      address
    };
    if (selectedClient) {
      dispatch(clientsActions.updateAction({ id: selectedClient.id, ...payload }));
      setSuccessfulEditionNotificationVisible(true);
    } else {
      dispatch(clientsActions.createAction(payload));
      setSuccessfulAdditionNotificationVisible(true);
    }
    hideModal();
  };

  const handleEdit = (client: any) => {
    setSelectedClient(client);
    setCuit(client.cuit);
    setCompanyName(client.companyName);
    setCondIvaTypeId(String(client.condIvaTypeId));
    setAddress(client.address);
    setVisible(true);
  };

  const handleDelete = (id: string) => {
    dispatch(clientsActions.removeAction(id));
    setDeleteConfirmationVisible(false);
    setSuccessfulDeletionNotificationVisible(true);
  };

  return (
    <PaperProvider>
      <Stack.Screen options={{ title: 'Clientes' }} />
      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modal}>
          <View style={{ flex: 1, padding: 16 }}>
            <TextInput
              label="CUIT"
              value={cuit}
              onChangeText={setCuit}
              keyboardType="numeric"
              maxLength={11}
              style={ styles.input }
              activeUnderlineColor='#429E9D'
            />
            <TextInput
              label="Razón Social"
              value={companyName}
              onChangeText={setCompanyName}
              maxLength={30}
              style={ styles.input }
              activeUnderlineColor='#429E9D'
            />
            <Dropdown
              label="Condición frente al IVA"
              placeholder="Seleccionar"
              options={condIvaOptions}
              value={condIvaTypeId}
              onSelect={setCondIvaTypeId}
              mode='outlined'
              menuContentStyle={{ backgroundColor: 'white' }}
            />
            <TextInput
              label="Dirección"
              value={address}
              onChangeText={setAddress}
              maxLength={40}
              style={ styles.input }
              activeUnderlineColor='#429E9D'
            />
            <Button
              mode="contained"
              onPress={handleSave}
              icon={selectedClient ? 'pencil' : 'plus'}
              disabled={!cuit || !companyName || !condIvaTypeId || !address}
              style={ styles.button }
            >
              {selectedClient ? 'Guardar cliente' : 'Agregar cliente'}
            </Button>
          </View>
        </Modal>
      </Portal>

      <View style={{ flex: 1, backgroundColor: 'white', height: '100%' }}>
        <Searchbar
          placeholder="Buscar cliente..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{ marginBottom: 8, marginTop: 8, backgroundColor: 'white', borderColor: 'lightgray', borderWidth: 1, marginHorizontal: 16 }}
        />
        <View style={{ height: '85%' }} >
          <ScrollView>
            <DataTable>
              <DataTable.Header style={{ borderWidth: 0, backgroundColor: 'white' }}>
                <DataTable.Title style={{ flex: 2.4, minWidth: 0 }}>Cliente</DataTable.Title>
                <DataTable.Title style={{ flex: 0.6 }}>Acciones</DataTable.Title>
              </DataTable.Header>
              {paginatedItems.map((item: any, idx: number) => (
                <React.Fragment key={item.id}>
                  <DataTable.Row style={{ borderWidth: 0, backgroundColor: 'white' }}>
                    <DataTable.Cell
                      style={{
                        flex: 2,
                        minWidth: 0,
                        flexDirection: 'column',
                        flexWrap: 'wrap',
                        paddingVertical: 4,
                      }}
                    >
                      <View style={{ flexDirection: 'column', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        <Text variant="bodyMedium">{item.address}</Text>
                        <Text variant="bodyMedium">{item.cuit}</Text>
                        <Text variant="bodyMedium">{item.companyName}</Text>
                      </View>
                    </DataTable.Cell>
                    <DataTable.Cell style={{ flex: 1 }}>
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
                          onPress={() => { setCuit(item.cuit); setClientToDeleteId(item.id); setDeleteConfirmationVisible(true) } }
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
        <View style={{ height: '15%', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 }}>
          <Text variant="bodyMedium" style={{ marginBottom: 90 }}>
            {items.length} clientes agregados
          </Text>
        </View>
        <FAB
          icon="plus"
          label=""
          color="white"
          onPress={showModal}
          style={{ position: 'absolute', bottom: '2%', right: '10%', backgroundColor: '#429E9D' }}
        />
      </View>
      <ActionNotification type="success" source="clients" target={`#${cuit}`} action="create" onDismiss={ ()=> {setSuccessfulAdditionNotificationVisible(false)} } visible={successfulAdditionNotificationVisible} />
      <ActionNotification type="success" source="clients" target={`#${cuit}`} action="update" onDismiss={ ()=> {setSuccessfulEditionNotificationVisible(false)} } visible={successfulEditionNotificationVisible} />
      <ActionNotification type="success" source="clients" target={`#${cuit}`} action="remove" onDismiss={ ()=> {setSuccessfulDeletionNotificationVisible(false)} } visible={successfulDeletionNotificationVisible} />
      <DeleteConfirmation source="clients" target={`${cuit}`} onConfirm={ ()=> {handleDelete(clientToDeleteId)} } onDismiss={ ()=> { setDeleteConfirmationVisible(false); setCuit(''); setClientToDeleteId('') } } visible={deleteConfirmationVisible} />
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  modal: { backgroundColor: 'white', padding: 20 },
  input: { marginBottom: 8, backgroundColor: 'white' },
  button: { marginTop: 16, backgroundColor: '#429E9D' }
});