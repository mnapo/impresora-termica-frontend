import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { invoicesActions } from '../../store/invoices';
import { useDispatch, useSelector } from 'react-redux';
import { View, StyleSheet, FlatList } from 'react-native';
import { PaperProvider, Portal, Button, SegmentedButtons, Card, IconButton, Text, FAB } from 'react-native-paper';

export default function InvoicesScreen() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [selectedType, setSelectedType] = useState<'arca' | 'comprobante'>('arca');
  const { items, loading } = useSelector((state: any) => state.invoices);
  const [open, setOpen] = useState(false);

    useEffect(() => {
        dispatch(invoicesActions.fetchAction());
    }, []);

    const handleFabPress = () => {setOpen(!open)};

    const handleNewInvoice = ( type: string ) => {
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

    return (<PaperProvider>
        <View style={styles.container}>
            <SegmentedButtons
                value={selectedType}
                onValueChange={(value) => setSelectedType(value as 'arca' | 'comprobante')}
                buttons={[
                { value: 'arca', label: 'Facturas ARCA' },
                { value: 'comprobante', label: 'Comprobantes' },
                ]}
                style={styles.segmented}
            />
            <View style={styles.listContainer}>
                <FlatList
                    data={items.sort((a: any, b: any) => b.id - a.id).filter((item: any) => item.type === selectedType)}
                    refreshing={loading}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                    <Card style={{ marginTop: 1, backgroundColor: 'white' }}>
                        <Card.Content>
                            <View style={{ backgroundColor: 'white' }} >
                                <Text variant="titleLarge">CUIT: {item.cuit}</Text>
                                <Text variant="bodyMedium">Total: ${item.total}</Text>
                                <Text variant="bodyMedium">Emisión: {item.createdAt}</Text>
                                <Text variant="bodyMedium">Dirección: {item.address}</Text>
                            </View>
                        </Card.Content>
                        <Card.Actions>
                            <Button icon="eye" onPress={() => handleWatchInvoice(item.id)} buttonColor= 'black' textColor='white' >Detalle</Button>
                            <Button icon="printer" mode="outlined" onPress={() => handlePrintInvoice(item.id)} textColor='lightseagreen' >Imprimir</Button>
                        </Card.Actions>
                    </Card>
                    )}
                />
            </View>
        </View>
        <Portal>
            <FAB.Group
            open={open}
            visible
            color="black"
            label="NUEVO"
            variant="surface"
            icon={open ? 'minus-box' : 'plus'}
            actions={[
                {
                icon: 'content-paste',
                label: 'factura ARCA',
                onPress: () => { handleNewInvoice('arca') },
                },
                {
                icon: 'file',
                label: 'comprobante',
                onPress: () => { handleNewInvoice('comprobante') },
                },
            ]}
            onStateChange={handleFabPress}
            />
        </Portal>
    </PaperProvider>);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    height: '100%',
    backgroundColor: 'white',
  },
  segmented: {
    color: 'lightseagreen',
    marginBottom: 16,
  },
  listContainer: {
    flex: 1,
  },
});