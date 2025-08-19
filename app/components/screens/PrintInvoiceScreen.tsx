import React, { useEffect, useState } from "react";
import { View } from "react-native";
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

  const onLoadedInvoice =() => {
    window.print();
    setTimeout(() => router.push({pathname: '/(tabs)/invoices'}), 800);
  }

  useEffect(() => {
    pollCondition(checkLoadedInvoice, 500, onLoadedInvoice);
  }, [items, clientData]);

  if (!invoice) {
    return <Text>Cargando factura...</Text>;
  }

  const total = items.reduce((acc, it) => acc + (it.price || 0) * (it.quantity || 1), 0);

  return (
    <View style={{ padding: 20, width: '100%' }}>
      <Stack.Screen options={{ headerShown: false }}/>
      {invoice.type === 'arca'?
        (<Text>Factura "A"</Text>)
        :(<Text>Comprobante</Text>)}
      <Text style={{ fontSize: 14, marginBottom: 10 }}>
        Nro.: #{String(invoice.id).padStart(8, '0')}
      </Text>
      <Text style={{ fontSize: 14}}>Cliente: {clientData?.name}</Text>
      <Text style={{ fontSize: 14}}>CUIT: {clientData?.cuit}</Text>
      <Text style={{ fontSize: 14}}>Fecha: {new Date(invoice.createdAt).toLocaleDateString()}</Text>
      <DataTable style={{ width: '50%', borderBottomWidth: 0 }}>
        <DataTable.Header style={{ borderBottomWidth: 0 }}>
          <DataTable.Title textStyle={{ fontSize: 20 }}>Producto</DataTable.Title>
          <DataTable.Title textStyle={{ fontSize: 20 }} numeric>Cantidad</DataTable.Title>
          <DataTable.Title textStyle={{ fontSize: 20 }} numeric>Precio</DataTable.Title>
          <DataTable.Title textStyle={{ fontSize: 20 }} numeric>Subtotal</DataTable.Title>
        </DataTable.Header>

        {items.map((item, i) => (
          <DataTable.Row key={i} style={{ borderBottomWidth: 0 }}>
            <DataTable.Cell textStyle={{ fontSize: 20 }}>{item.name}</DataTable.Cell>
            <DataTable.Cell textStyle={{ fontSize: 20 }} numeric>{item.quantity}</DataTable.Cell>
            <DataTable.Cell textStyle={{ fontSize: 20 }} numeric>${item.price}</DataTable.Cell>
            <DataTable.Cell textStyle={{ fontSize: 20 }} numeric>
              ${item.price * item.quantity}
            </DataTable.Cell>
          </DataTable.Row>
        ))}

        <DataTable.Row style={{ borderBottomWidth: 0 }}>
          <DataTable.Cell textStyle={{ fontSize: 24 }}>Total: ${total}</DataTable.Cell>
        </DataTable.Row>
      </DataTable>
    </View>
  );
}