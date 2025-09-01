import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { DataTable, Text, Divider } from "react-native-paper";
import client from "../../feathersClient";

export default function WatchInvoiceScreen() {
  const { invoiceId } = useLocalSearchParams<{ invoiceId: string }>();
  const [invoice, setInvoice] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  
  const router = useRouter();

  useEffect(() => {
    if (!invoiceId) return;

    client.service("invoices").get(invoiceId).then((inv: any) => {
      setInvoice(inv);

      client
        .service("invoices-items")
        .find({
          query: {
            invoiceId: invoiceId,
          },
        })
        .then((res: any) => {
          setItems(res.data || []);
        });
    });
  }, [invoiceId]);

  if (!invoice) {
    return <Text>Cargando factura...</Text>;
  }

  const total = items.reduce((acc, it) => acc + (it.price || 0) * (it.quantity || 1), 0);

  return (<>
    <Stack.Screen options={{ title: "Regresar" }}/>
    <View style={ styles.container }>
      {invoice.type === 'arca'?
        (<Text style={ styles.invoiceType }>Factura "A"</Text>)
        :(<Text style={ styles.invoiceType }>Comprobante</Text>)}
      <Text style={ styles.invoiceTitle }>
        Nro.: #{String(invoice.id).padStart(8, '0')}
      </Text>
      <Text style={ styles.invoiceInfo }>Fecha: {new Date(invoice.createdAt).toLocaleDateString()}</Text>
      <Text style={ styles.invoiceInfo }>CUIT: {invoice.cuit}</Text>
      <Text style={ styles.invoiceInfo }>Razón Social: {invoice.companyName}</Text>
      <Divider/>
      <DataTable style={{ width: '95%', borderBottomWidth: 0 }}>
        <DataTable.Header style={{ borderBottomWidth: 0 }}>
          <DataTable.Title style={{ flex: 2 }} textStyle={ styles.itemRow }>Producto</DataTable.Title>
          <DataTable.Title style={{ flex: 1 }} textStyle={ styles.itemRow } numeric>Cant.</DataTable.Title>
          <DataTable.Title style={{ flex: 1 }} textStyle={ styles.itemRow } numeric>Precio</DataTable.Title>
          <DataTable.Title style={{ flex: 1 }} textStyle={ styles.itemRow } numeric>Subtotal</DataTable.Title>
        </DataTable.Header>

        {items.map((item, i) => (
          <DataTable.Row key={i} style={{ borderBottomWidth: 0 }}>
            <DataTable.Cell style={{ flex: 2 }} textStyle={ styles.itemRow }>{item.name}</DataTable.Cell>
            <DataTable.Cell style={{ flex: 1 }} textStyle={ styles.itemRow } numeric>{item.quantity}</DataTable.Cell>
            <DataTable.Cell style={{ flex: 1 }} textStyle={ styles.itemRow } numeric>${item.price}</DataTable.Cell>
            <DataTable.Cell style={{ flex: 1 }} textStyle={ styles.itemRow } numeric>
              ${item.price * item.quantity}
            </DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
      <Divider/>
      {invoice.type === 'arca'?
        (<>
          <Text style={{ fontSize: 24, fontWeight: 400 }}>Total S/ IVA: ${total}</Text>
          <Text style={{ fontSize: 24, fontWeight: 400 }}>IVA 21%: ${(total / 0.21).toFixed(2)}</Text>
          <Text style={{ fontSize: 26, fontWeight: 800 }}>Total: ${(total / 1.21).toFixed(2)}</Text>
        </>)
        :(<Text style={{ fontSize: 26, fontWeight: 800 }}>Total: ${total}</Text>)
      }
    </View>
  </>);
}

const styles = StyleSheet.create({
  container: { padding: 10, width: '100%' },
  invoiceType: { fontSize: 18, marginBottom: 5 },
  invoiceTitle: { fontSize: 18, marginBottom: 10 },
  invoiceInfo: { fontSize: 16 },
  itemRow: { fontSize: 14, fontWeight: 300 },
});