import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput,
  Button,
  IconButton,
  Searchbar,
  Text,
  FAB,
  PaperProvider,
  Portal,
  Modal,
  DataTable,
  Divider
} from 'react-native-paper';
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

  const [page, setPage] = useState(0);
  const itemsPerPage = 100;
  const [searchQuery, setSearchQuery] = useState('');
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
  }, [items]);

  const handleAdd = () => {
    if (!companyName || !condIvaTypeId || !cuit || !address) return;
    dispatch(clientsActions.createAction({
      cuit,
      companyName,
      condIvaTypeId: parseInt(condIvaTypeId) || NON_REGISTERED_CONDIVATYPE_ID,
      address
    }));
    setCuit('');
    setCompanyName('');
    setCondIvaTypeId('');
    setAddress('');
    hideModal();
  };

  const handleDelete = (id: string) => {
    dispatch(clientsActions.removeAction(id));
  };

  function capitalize(text: string) {
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
      <Stack.Screen options={{ title: 'Clientes' }} />
      <Portal>
        <Modal visible={visibleImportFromCsvModal} onDismiss={() => { setVisibleImportFromCsvModal(false) }} contentContainerStyle={styles.modal}>
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

      <View style={{ flex: 1, backgroundColor: 'white', height: '100%' }}>
        <Searchbar
          placeholder="Buscar cliente..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{ marginBottom: 8, marginTop: 8 }}
        />
        <View style={{ height: '82%' }}>
          <ScrollView>
            <DataTable>
              <DataTable.Header style={{ borderWidth: 0, backgroundColor: 'white' }}>
                <DataTable.Title style={{ flex: 2.4, minWidth: 0 }}>Información</DataTable.Title>
                <DataTable.Title style={{ flex: 0.6 }}>Acciones</DataTable.Title>
              </DataTable.Header>
              {paginatedItems.map((item: any, idx: number) => (
                <React.Fragment key={item.id}>
                  <DataTable.Row style={{ borderWidth: 0, backgroundColor: 'white' }}>
                    <DataTable.Cell
                      style={{
                        flex: 2.4,
                        minWidth: 0,
                        flexDirection: 'column',
                        flexWrap: 'wrap',
                        paddingVertical: 4,
                      }}
                    >
                      <View style={{ flexDirection: 'column', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        <Text variant="bodyMedium">CUIT: {item.cuit}</Text>
                        <Text variant="bodyMedium">RAZÓN SOCIAL: {item.companyName}</Text>
                        <Text variant="bodyMedium">DIRECCIÓN: {item.address}</Text>
                        <Text variant="bodyMedium">
                          CONDICION IVA: {condIvaOptions.find(condIvaType => condIvaType.value === String(item.condIvaTypeId))?.label}
                        </Text>
                      </View>
                    </DataTable.Cell>
                    <DataTable.Cell style={{ flex: 0.6 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <IconButton
                          icon="delete"
                          size={24}
                          style={{ backgroundColor: 'red' }}
                          iconColor="white"
                          onPress={() => handleDelete(item.id)}
                        />
                      </View>
                    </DataTable.Cell>
                  </DataTable.Row>
                  {idx < paginatedItems.length - 1 && (
                    <Divider style={{ height: 1, backgroundColor: '#eee', marginHorizontal: 8 }} />
                  )}
                </React.Fragment>
              ))}
              <DataTable.Pagination
                page={page}
                numberOfPages={totalPages}
                onPageChange={setPage}
                label={`Página ${page + 1} de ${totalPages}`}
                showFastPaginationControls
                numberOfItemsPerPage={itemsPerPage}
                selectPageDropdownLabel={'Filas por página'}
              />
            </DataTable>
          </ScrollView>
        </View>
        <View style={{ height: '18%', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 1 }}>
          <Text variant="bodyMedium" style={{ marginBottom: 50 }}>
            {items.length} clientes agregados
          </Text>
        </View>
        <FAB
          icon="plus"
          label=""
          color="white"
          onPress={showModal}
          style={{ position: 'absolute', bottom: '2%', right: '10%', backgroundColor: 'black' }}
        />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  modal: { backgroundColor: 'white', padding: 20 },
});