import React, { useEffect, useState } from "react";
import { View, Platform } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Divider, Text } from "react-native-paper";
import client from "../../feathersClient";

export default function PrintInvoiceScreen() {
  const { invoiceId } = useLocalSearchParams<{ invoiceId: string }>();

  const [invoice, setInvoice] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [clientData, setClientData] = useState<any>(null);
  const [shown, setShown] = useState(false);
  
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

  useEffect(() => {
    if (Platform.OS === "web" && !shown) {
      setShown(true);
      setTimeout(() => {
        window.print();
      }, 500);
      setTimeout(() => {
        router.push({pathname: '/(tabs)/invoices'});
      }, 800);
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
      <Stack.Screen options={{ headerShown: false }}/>
      {invoice.type === 'arca'?
        (<Text>Factura "A"</Text>)
        :(<Text>Comprobante</Text>)}
      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        Factura #{String(invoice.id).padStart(8, '0')}
      </Text>
      <Text style={{ fontFamily: 'Ticketing' }}>Cliente: {clientData?.name}</Text>
      <Text>CUIT: {clientData?.cuit}</Text>
      <Text>Fecha: {new Date(invoice.createdAt).toLocaleDateString()}</Text>
      {items.map((item, i) => (
        <View>
          <Text>{item.name}</Text>
          <Text>{item.quantity}</Text>
          <Text>${item.price}</Text>
          <Text>
            ${(item.price * item.quantity).toFixed(2)}
          </Text>
        </View>
      ))}

    </View>
  );
}