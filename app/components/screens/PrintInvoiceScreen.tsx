import React, { useEffect, useState } from "react";
import { View, Text, Platform } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { DataTable } from "react-native-paper";
import client from "../../feathersClient";

export default function PrintInvoiceScreen() {
  const { invoiceId } = useLocalSearchParams<{ invoiceId: string }>();

  const [invoice, setInvoice] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [clientData, setClientData] = useState<any>(null);
  const [shown, setShown] = useState(false);

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

  useEffect(() => {
    if (Platform.OS === "web" && !shown) {
      setShown(true);
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, [items, clientData]);

  if (!invoice) {
    return <Text>Cargando factura...</Text>;
  }

  const total = items.reduce(
    (acc, it) => acc + (it.price || 0) * (it.quantity || 1),
    0
  );

  return (
    <View style={{ padding: 20}}>
      {invoice.type === 'arca'?(<Stack.Screen options={{ title: 'Factura A' }}/>):(<Stack.Screen options={{ title: 'Comprobante' }}/>)}
      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        Factura #{invoice.id}
      </Text>
      <Text style={{ fontFamily: 'Ticketing' }}>Cliente: {clientData?.name}</Text>
      <Text>CUIT: {clientData?.cuit}</Text>
      <Text>Fecha: {new Date(invoice.createdAt).toLocaleDateString()}</Text>

      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Producto</DataTable.Title>
          <DataTable.Title numeric>Cantidad</DataTable.Title>
          <DataTable.Title numeric>Precio</DataTable.Title>
          <DataTable.Title numeric>Subtotal</DataTable.Title>
        </DataTable.Header>

        {items.map((item, i) => (
          <DataTable.Row key={i}>
            <DataTable.Cell>{item.name}</DataTable.Cell>
            <DataTable.Cell numeric>{item.quantity}</DataTable.Cell>
            <DataTable.Cell numeric>${item.price}</DataTable.Cell>
            <DataTable.Cell numeric>
              ${item.price * item.quantity}
            </DataTable.Cell>
          </DataTable.Row>
        ))}

        <DataTable.Row>
          <DataTable.Cell>Total</DataTable.Cell>
          <DataTable.Cell numeric>${total}</DataTable.Cell>
        </DataTable.Row>
      </DataTable>
    </View>
  );
}