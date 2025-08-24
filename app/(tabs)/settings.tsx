import React from 'react';
import { useRouter } from 'expo-router'
import { View } from 'react-native';
import { Button, Chip, Icon } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function SettingsScreen() {
  const {signOut} = useAuth();
  const router = useRouter();

  const goToClientsScreen = () => {
      router.push({
          pathname: '/components/screens/ClientsScreen',
      });
  };
  const goToProductsScreen = () => {
      router.push({
          pathname: '/components/screens/ProductsScreen',
      });
  };
  return (
    <View style={styles().container}>
      <Chip style={styles().connectionState} icon={() => (
        <Icon source="circle" size={16} color="green" />
      )}>conexión ARCA establecida</Chip>
      <Button onPress={goToClientsScreen} mode="contained-tonal" style={styles().button}>Clientes</Button>
      <Button onPress={goToProductsScreen} mode="contained-tonal" style={styles().button}>Productos</Button>
      <Button onPress={signOut} mode="contained" style={styles().button} buttonColor="red">Cerrar sesión</Button>
    </View>
  );
}

const styles = () => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20},
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  connectionState: {
    marginRight: 75,
    marginBottom: 10
  },
  button: {
    marginBottom: 5
  }
});