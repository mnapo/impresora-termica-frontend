import React, { useState, useEffect } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Button, TextInput, IconButton } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { productsActions } from '../../store/products';
import { clientsActions } from '../../store/clients';
import client from '../../feathersClient';

export default function NewInvoiceScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const dispatch = useDispatch();

  const products = useSelector((state: RootState) => state.products.items || []);
  const clients = useSelector((state: RootState) => state.clients.items || []);

  const [clientId, setClientId] = useState('');
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    dispatch(productsActions.fetchAction());
    dispatch(clientsActions.fetchAction());
  }, [dispatch]);

  useEffect(() => {
    navigation.setOptions({
      title: "Nuevo Documento",
    });
  }, [navigation]);

  const addItem = () => {
    setItems([...items, { productId: '', name: '', price: 0, quantity: 1 }]);
  };

  const updateItemProduct = (index: number, productId: string) => {
    const product = products.find((p: any) => String(p.id) === String(productId));
    setItems(prev =>
      prev.map((item, i) =>
        i === index
          ? { ...item, productId, name: product?.name || '', price: product?.price || 0 }
          : item
      )
    );
  };

  const updateQuantity = (index: number, delta: number) => {
    setItems(prev =>
      prev.map((item, i) =>
        i === index
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const saveInvoice = async () => {
    try {
      console.log(clientId)
      const invoice = await client.service('invoices').create({
        type: 'arca',
        clientId: 3,
        userId: 1,
        total: 0,
        subtotal: 0
      });

      for (const item of items) {
        await client.service('invoices-items').create({
          invoiceId: invoice.id,
          userId: 1,
          name: item.name,
          price: item.price,
        });
      }

      console.log('Factura y items guardados correctamente');
      router.push({pathname: '/components/screens/InvoicesScreen'});
    } catch (error) {
      console.error('Error guardando factura:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Cliente:</Text>
      <Picker
        selectedValue={clientId}
        onValueChange={(value) => setClientId(value)}
      >
        <Picker.Item label="Seleccione un cliente" value="" />
        {clients.map((client: any) => (
          <Picker.Item key={client.id} label={client.address} value={client.id} />
        ))}
      </Picker>

      <FlatList
        data={items}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.itemRow}>
            <Picker
              selectedValue={item.productId}
              onValueChange={(value) => updateItemProduct(index, value)}
              style={{ flex: 1 }}
            >
              <Picker.Item label="Seleccione producto" value="" />
              {products.map((product: any) => (
                <Picker.Item key={product.id} label={product.name} value={product.id} />
              ))}
            </Picker>

            <TextInput
              mode="outlined"
              label="Precio"
              style={styles.inputSmall}
              value={item.price.toString()}
            />
            <View style={styles.quantityRow}>
              <IconButton icon="minus" size={20} onPress={() => updateQuantity(index, -1)} />
              <Text>{item.quantity}</Text>
              <IconButton icon="plus" size={20} onPress={() => updateQuantity(index, 1)} />
            </View>
            <IconButton icon="delete" size={20} onPress={() => removeItem(index)} />
          </View>
        )}
        ListFooterComponent={
          <Button mode="contained" onPress={addItem} style={styles.addButton}>
            Agregar producto
          </Button>
        }
      />

      <Button
        mode="contained"
        onPress={saveInvoice}
        disabled={!clientId || items.length === 0}
        style={styles.saveButton}
      >
        Guardar factura
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  label: { fontWeight: 'bold', marginBottom: 5 },
  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  inputSmall: { width: 80, marginHorizontal: 5 },
  quantityRow: { flexDirection: 'row', alignItems: 'center' },
  addButton: { marginTop: 10 },
  saveButton: { marginTop: 20 }
});
