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
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visibleImportFromCsvModal, setVisibleImportFromCsvModal] = useState(false);
  const [csvContent, setCsvContent] = useState('');
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

  function capitalize( text: string ) {
    return text.split(' ').map(word => {
      if (word.length === 0) {
        return '';
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
  }

  const handleCsvImport = () => {
    const lines = capitalize(csvContent).split('\n');
    lines.forEach(line => {
      let [address, companyName, cuit] = line.split(',').map(item => item.trim());
      let condIvaTypeId = 1;
      if (!cuit) { cuit = '0'; condIvaTypeId = NON_REGISTERED_CONDIVATYPE_ID }
      if (!companyName) { companyName = '-' }
      if (!address) { cuit = '-' }
      if (cuit && companyName && address) {
        dispatch(clientsActions.createAction({ cuit, companyName, condIvaTypeId, address }));
      }
    });
    setCsvContent('');
    setVisibleImportFromCsvModal(false);
  };

  return (
    <PaperProvider>
      <Stack.Screen options={{ title: 'Clientes' }}/>
      <Portal>
        <Modal visible={visibleImportFromCsvModal} onDismiss={ ()=>{ setVisibleImportFromCsvModal(false) } } contentContainerStyle={styles.modal}>
          <View style={{ height: '100%', flex: 1, padding: 16 }}>
            <TextInput
              label="CSV de Clientes"
              value={csvContent}
              onChangeText={text => setCsvContent(text)}
              multiline={true}
              numberOfLines={4}
              style={{ minHeight: 100 }}
            />
            <Button mode="contained" onPress={handleCsvImport} icon='file-import' disabled={!csvContent}>
              Cargar CSV
            </Button>
          </View>
        </Modal>
      </Portal>
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
              label="Dirección"
              value={address}
              onChangeText={setAddress}
              style={{ marginBottom: 8 }}
            />
            <Dropdown
              label="Condición frente al IVA"
              placeholder="Seleccionar"
              options={condIvaOptions}
              value={condIvaTypeId}
              onSelect={setCondIvaTypeId}
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
            <Card style={{ marginTop: 1 }}>
              <Card.Content>
                  <Text variant="titleLarge">CUIT: {item.cuit}</Text>
                  <Text variant="bodyMedium">RAZÓN SOCIAL: {item.companyName}</Text>
                  <Text variant="bodyMedium">DIRECCIÓN: {item.address}</Text>
                  <Text variant="bodyMedium">CONDICION IVA: {condIvaOptions.find(condIvaType => condIvaType.value === String(item.condIvaTypeId))?.label}</Text>
              </Card.Content>
              <Card.Actions>
                <IconButton
                  icon="delete"
                  onPress={() => handleDelete(item.id)}
                />
              </Card.Actions>
            </Card>
          )}
        />
        <Portal>
          <FAB.Group
          open={open}
          visible
          style={{ paddingBottom: '10%' }}
          fabStyle={{ backgroundColor: 'black' }}
          color="white"
          label=""
          variant="surface"
          icon={open ? 'minus-box' : 'plus'}
          actions={[
              {
              icon: 'plus',
              label: 'nuevo cliente',
              onPress: ()=>{}
              },
              {
              icon: 'phone',
              label: 'importar desde contactos',
              onPress: ()=>{}
              },
              {
              icon: 'paperclip',
              label: 'importar desde CSV',
              onPress: ()=>{ setVisibleImportFromCsvModal(true) }
              },
          ]}
          onStateChange={ () => { setOpen(!open) }}
          />
        </Portal>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  modal: {backgroundColor: 'white', padding: 20},
});