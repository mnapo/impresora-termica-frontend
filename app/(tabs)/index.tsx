import React from 'react';
import { StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { View } from 'react-native';
import { Text, Button, Divider, Icon } from 'react-native-paper';

export default function TabsHome() {
  const { user } = useAuth();
  return (
    <View style={styles.container}>
      <Text style={styles.title2}><Icon source="account-outline" size={32}/>{user.lastName.toUpperCase()} {user.firstName.toUpperCase()}👋</Text>
      <Divider style={styles.divider} />
      <Button style={styles.button} mode="contained-tonal">Mis facturas</Button>
      <Button style={styles.button} mode="contained-tonal">Ver Clientes</Button>
      <Button style={styles.button} mode="contained-tonal">Ver Productos</Button>
      <Button style={styles.button} mode="contained-tonal">Estadísticas</Button>
      <Button style={styles.button} mode="contained-tonal">Editar mis datos</Button>
      <Button style={styles.button} mode="contained-tonal">Configurar estilos de impresión</Button>
      <Divider style={styles.divider} />
      <Text style={styles.title1}>En construcción...</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
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