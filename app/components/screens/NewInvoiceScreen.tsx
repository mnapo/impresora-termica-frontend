import React, { useState, useEffect } from 'react';
import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Button, TextInput, IconButton, Divider, FAB, SegmentedButtons, Chip } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { productsActions } from '../../store/products';
import { clientsActions } from '../../store/clients';
import client from '../../feathersClient';
import ClientSelector from '../ClientSelector';
import ItemSelector from '../ItemSelector';

export default function NewInvoiceScreen({ navigation }: any) {
  const dispatch = useDispatch();
  const params = useLocalSearchParams();
  const selectedType = params.type;
  const products = useSelector((state: RootState) => state.products.items || []);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [clientId, setClientId] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const [pricesList, setPricesList] = React.useState('');

  useEffect(() => {
    dispatch(productsActions.fetchAction());
    dispatch(clientsActions.fetchAction());
  }, [dispatch]);

  const addItem = () => {
    setItems([...items, { productId: selectedItem.id, name: selectedItem.name, price: '', quantity: 1 }]);
    setSelectedItem(null);
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
      const invoice = await client.service('invoices').create({
        type: selectedType,
        address: clientId,
        subtotal: 0,
        total: 0
      });

      for (const item of items) {
        await client.service('invoices-items').create({
          invoiceId: invoice.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        });
      }

      console.log('Factura y items guardados correctamente');
      navigation.goBack();
    } catch (error) {
      console.error('Error guardando factura:', error);
    }
  };

  return (
    <View style={{ height:'100%', padding: 16 }}>
      <View>
        {selectedClient ? (
          <View style={{ height: '30%', paddingHorizontal: 16 }}>
            <Text style={{ fontWeight: 'bold' }}>CUIT: {selectedClient.cuit}</Text>
            <Text>RAZÓN SOCIAL: {selectedClient.companyName}</Text>
            <Text>DIRECCIÓN: {selectedClient.address}</Text>
            <Text>CONDICIÓN FRENTE AL IVA: {selectedClient.condIvaType}</Text>
            <Button onPress={() => setSelectedClient(null)}>Cambiar Cliente</Button>
          </View>
        ) : (
          <View style={{ }}>
            <ClientSelector onSelect={(client) => setSelectedClient(client)} />
          </View>
        )}
      </View>
      <SegmentedButtons
        value={pricesList}
        onValueChange={setPricesList}
        buttons={[
          {
            value: 'list1',
            label: 'Lista 1',
          },
          {
            value: 'list2',
            label: 'Lista 2',
          },
          { 
            value: 'list3',
            label: 'Lista 3'
          },
        ]}
      />
      <Divider style={{ marginVertical: 10 }} />
      <View style={{ }}>
        {selectedItem ? (
          <View style={{ height: '30%', paddingHorizontal: 16 }}>
            <Text style={{ fontWeight: 'bold' }}>Producto a agregar: {selectedItem.name}</Text>
            <Text>Precio: ${selectedItem.price}</Text>
            <Button onPress={() => setSelectedItem(null)}>Cambiar Item</Button>
          </View>
        ) : (
          <View style={{ }}>
            <ItemSelector onSelect={(item) => setSelectedItem(item)} />
          </View>
        )}
      </View>
      <Button mode="contained" onPress={addItem} style={styles.addButton}>
        Agregar item
      </Button>
      <Text style={styles.label}>ITEMS</Text>
      <Divider />
      <View style={{height: '45%'}}>
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
        />
      </View>
      <Chip icon="information" textStyle={{fontSize: 16}} style={{position: 'absolute', bottom: '2%', left: '2%'}}>Total: $0</Chip>
      <FAB
        icon="plus"
        label="Guardar Factura"
        style={{position: 'absolute', bottom: '2%', left: '52%'}}
        onPress={saveInvoice}
        disabled={!selectedClient || items.length === 0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  label: { fontWeight: 'bold', marginBottom: 5 },
  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  inputSmall: { width: 80, marginHorizontal: 5 },
  quantityRow: { flexDirection: 'row', alignItems: 'center' },
  addButton: { marginTop: 5 },
  saveButton: { marginTop: 20 },
});