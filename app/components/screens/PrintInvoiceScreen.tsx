import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { DataTable, Text, Divider } from "react-native-paper";
import client from "../../feathersClient";
import pollCondition from "../../../helpers/pollCondition"

export default function PrintInvoiceScreen() {
  const { invoiceId } = useLocalSearchParams<{ invoiceId: string }>();

  const [invoice, setInvoice] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [clientData, setClientData] = useState<any>(null);
  
  const router = useRouter();

  const html = `
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
    </head>
    <body style="text-align: center;">
      <h1 style="font-size: 50px; font-family: Helvetica Neue; font-weight: normal;">
        Hello Expo!
      </h1>
      <img
        src="https://d30j33t1r58ioz.cloudfront.net/static/guides/sdk.png"
        style="width: 90vw;" />
    </body>
  </html>
  `;

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

      if (inv.clientId) {
        client.service("clients").get(inv.clientId).then((cl: any) => {
          setClientData(cl);
        });
      }
    });
  }, [invoiceId]);

  const checkLoadedInvoice = () => {return invoice};

  const onLoadedInvoice = async () => {
    window.open("https://google.com")
  }

  useEffect(() => {
    pollCondition(checkLoadedInvoice, 500, onLoadedInvoice);
  }, [items, clientData]);

  if (!invoice) {
    return <Text>Cargando factura...</Text>;
  }

  const total = items.reduce((acc, it) => acc + (it.price || 0) * (it.quantity || 1), 0);

  return (
    <View style={ styles.container }>
      <Stack.Screen options={{ headerShown: false }}/>
      {invoice.type === 'arca'?
        (<Text>Factura "A"</Text>)
        :(<Text>Comprobante</Text>)}
      <Text style={ styles.invoiceTitle }>
        Nro.: #{String(invoice.id).padStart(8, '0')}
      </Text>
      <Text style={ styles.invoiceInfo }>Cliente: {clientData?.name}</Text>
      <Text style={ styles.invoiceInfo }>CUIT: {clientData?.cuit}</Text>
      <Text style={ styles.invoiceInfo }>Fecha: {new Date(invoice.createdAt).toLocaleDateString()}</Text>
      <DataTable style={{ width: '95%', borderBottomWidth: 0 }}>
        <DataTable.Header style={{ borderBottomWidth: 0 }}>
          <DataTable.Title style={{ flex: 2}} textStyle={ styles.itemRow }>Producto</DataTable.Title>
          <DataTable.Title style={{ flex: 1}} textStyle={ styles.itemRow } numeric>Cant.</DataTable.Title>
          <DataTable.Title style={{ flex: 1}} textStyle={ styles.itemRow } numeric>Precio</DataTable.Title>
          <DataTable.Title style={{ flex: 1}} textStyle={ styles.itemRow } numeric>Subtotal</DataTable.Title>
        </DataTable.Header>

        {items.map((item, i) => (
          <DataTable.Row key={i} style={{ borderBottomWidth: 0 }}>
            <DataTable.Cell style={{ flex: 2}} textStyle={ styles.itemRow }>{item.name}</DataTable.Cell>
            <DataTable.Cell style={{ flex: 1}} textStyle={ styles.itemRow } numeric>{item.quantity}</DataTable.Cell>
            <DataTable.Cell style={{ flex: 1}} textStyle={ styles.itemRow } numeric>${item.price}</DataTable.Cell>
            <DataTable.Cell style={{ flex: 1}} textStyle={ styles.itemRow } numeric>
              ${item.price * item.quantity}
            </DataTable.Cell>
          </DataTable.Row>
        ))}

        <DataTable.Row style={{ borderBottomWidth: 0 }}>
          <DataTable.Cell textStyle={{ fontSize: 51, fontWeight: 800, fontFamily: 'Ticketing' }}>Total: ${total}</DataTable.Cell>
        </DataTable.Row>
      </DataTable>
      <Divider/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 1, width: '100%' },
  invoiceTitle: { fontFamily: 'Ticketing', fontSize: 34, marginBottom: 10 },
  invoiceInfo: { fontFamily: 'Ticketing', fontSize: 36 },
  itemRow: { fontFamily: 'Ticketing', fontSize: 44, fontWeight: 500 }
});