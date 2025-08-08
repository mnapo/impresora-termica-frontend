import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { invoicesActions } from '../../store/invoices';
import { useDispatch, useSelector } from 'react-redux';
import { View, StyleSheet, FlatList } from 'react-native';
import { Button, SegmentedButtons, Card, IconButton } from 'react-native-paper';


export default function InvoicesScreen() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [selectedType, setSelectedType] = useState<'arca' | 'comprobante'>('arca');
  const { items, loading } = useSelector((state: any) => state.invoices);

    useEffect(() => {
        dispatch(invoicesActions.fetchAction());
    }, []);

    const handleNewInvoice = () => {
        router.push({
        pathname: '/components/screens/NewInvoiceScreen',
        params: { type: selectedType },
        });
    };

    const handlePrint = (id: string) => {
    };

    const handleDelete = (id: string) => {
        dispatch(invoicesActions.removeAction(id));
    };

    return (
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

        <Button
            mode="contained"
            onPress={handleNewInvoice}
            style={styles.newButton}
        >
            Nuevo
        </Button>

        <View style={styles.listContainer}>
            <FlatList
                data={items.sort((a: any, b: any) => b.id - a.id).filter((item: any) => item.type === selectedType)}
                refreshing={loading}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                <Card style={{ marginTop: 12 }}>
                    <Card.Title title={`Factura del ${item.createdAt}`} subtitle={`para: ${item.clientId}`} />
                    <Card.Actions>
                    <IconButton
                        icon="delete"
                        onPress={() => handleDelete(item.id)}
                    />
                    <IconButton
                        icon="printer"
                        onPress={() => handlePrint(item.id)}
                    />
                    </Card.Actions>
                </Card>
                )}
            />
        </View>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  segmented: {
    marginBottom: 16,
  },
  newButton: {
    marginBottom: 24,
  },
  listContainer: {
    flex: 1,
  },
});