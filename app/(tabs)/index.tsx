import React from 'react';
import { StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { View } from 'react-native';
import { Text, Button, Divider, Icon } from 'react-native-paper';
import Option from '../components/Option'

export default function TabsHome() {
  const { user } = useAuth();
  return (
    <View style={styles.container}>
      <Text style={styles.title2}><Icon source="account-outline" size={32}/>{user.lastName.toUpperCase()} {user.firstName.toUpperCase()}👋</Text>
      <Divider style={styles.divider} />
      <View style={{ alignItems: 'center', paddingHorizontal: '10%' }}>
        <Option title="Mis Facturas" icon="book-multiple" path="(tabs)/invoices" />
        <Option title="Datos de Cuenta" icon="pencil" path="(tabs)/settings" />
        <Option title="Métricas" icon="chart-areaspline" path="" />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title1: {
    fontSize: 20,
  },
  title2: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  divider: {
    marginVertical: 10,
  },
  button: {
    marginVertical: 5
  }
});