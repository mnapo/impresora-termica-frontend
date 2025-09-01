import React, { useEffect, useState } from 'react';
import { useRouter, Stack } from 'expo-router';
import { invoicesActions } from '../../store/invoices';
import { useDispatch, useSelector } from 'react-redux';
import { ScrollView, View, StyleSheet } from 'react-native';
import { PaperProvider, Portal, Button, SegmentedButtons, DataTable, Text, FAB, IconButton } from 'react-native-paper';

export default function InvoicesScreen() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [selectedType, setSelectedType] = useState<'arca' | 'comprobante'>('comprobante');
  const { items, loading } = useSelector((state: any) => state.invoices);
  const [open, setOpen] = useState(false);

  const [page, setPage] = useState(0);
  const itemsPerPage = 100;

  useEffect(() => {
    dispatch(invoicesActions.fetchAction({}));
  }, []);

  const filteredItems = items
    .sort((a: any, b: any) => b.id - a.id)
    .filter((item: any) => item.type === selectedType);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  const handleFabPress = () => { setOpen(!open); };

  const handleNewInvoice = (type: string) => {
    router.push({
      pathname: '/components/screens/NewInvoiceScreen',
      params: { type: type },
    });
  };
  const handleWatchInvoice = (id: string) => {
    router.push({
      pathname: '/components/screens/WatchInvoiceScreen',
      params: { invoiceId: id },
    });
  };

  const handlePrintInvoice = async (id: string) => {
    const token = localStorage.getItem('feathers-jwt');
    if (!token) {
      alert('No estás autenticado');
      return;
    }
    const url = `${process.env.EXPO_PUBLIC_URL}/print?invoiceId=${id}&access_token=${token}`;
    window.open(url, '_blank');
  };

  const handlePrevPage = () => setPage((prev) => Math.max(prev - 1, 0));
  const handleNextPage = () => setPage((prev) => Math.min(prev + 1, totalPages - 1));

  return (
    <PaperProvider>
      {selectedType == 'arca' ? (
        <Stack.Screen options={{ title: 'Facturas ARCA' }} />
      ) : (
        <Stack.Screen options={{ title: 'Comprobantes' }} />
      )}
      <View style={styles.container}>
        <SegmentedButtons
          value={selectedType}
          onValueChange={(value) => {
            setSelectedType(value as 'arca' | 'comprobante');
            setPage(0);
          }}
          buttons={[
            {
              value: 'comprobante',
              label: 'Comprobantes',
              style: { backgroundColor: selectedType === 'comprobante' ? '#429E9D' : 'black' },
              labelStyle: { color: selectedType === 'arca' ? '#429E9D' : 'black' },
            },
            {
              value: 'arca',
              label: 'Facturas ARCA',
              style: { backgroundColor: selectedType === 'comprobante' ? 'black' : '#429E9D' },
              labelStyle: { color: selectedType === 'arca' ? 'black' : '#429E9D' },
            },
          ]}
          style={styles.segmented}
        />

        <View style={styles.listContainer}>
          <ScrollView>
            <DataTable>
              <DataTable.Header style={{ borderWidth: 0, backgroundColor: 'white' }}>
                <DataTable.Title style={{ flex: 2, minWidth: 0 }}>Información</DataTable.Title>
                <DataTable.Title style={{ flex: 1 }}>Acciones</DataTable.Title>
              </DataTable.Header>
              {paginatedItems.map((item: any) => (
                <DataTable.Row key={item.id} style={{ borderWidth: 0, backgroundColor: 'white' }}>
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
                      <Text variant="bodyMedium">CUIT: {item.cuit}</Text>
                      <Text variant="bodyMedium">Total: ${item.total}</Text>
                      <Text variant="bodyMedium">Emisión: {item.createdAt}</Text>
                      <Text variant="bodyMedium">Dirección: {item.address}</Text>
                    </View>
                  </DataTable.Cell>
                  <DataTable.Cell style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                      <IconButton
                        icon="eye"
                        size={28}
                        style={{ backgroundColor: '#429E9D', marginRight: 8 }}
                        iconColor="white"
                        onPress={() => handleWatchInvoice(item.id)}
                      />
                      <IconButton
                        icon="printer"
                        size={28}
                        style={{ backgroundColor: '#429E9D' }}
                        iconColor="white"
                        onPress={() => handlePrintInvoice(item.id)}
                      />
                    </View>
                  </DataTable.Cell>
                </DataTable.Row>
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
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    height: '100%',
    backgroundColor: 'white',
  },
  segmented: {
    marginBottom: 16,
  },
  listContainer: {
    flex: 1,
  },
});