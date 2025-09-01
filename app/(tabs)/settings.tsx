import React from 'react';
import { useRouter } from 'expo-router'
import { View } from 'react-native';
import { Button, TextInput, Chip, Icon, Divider } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import Option from '../components/Option'

export default function SettingsScreen() {
  const {signOut} = useAuth();

  return (
    <View style={styles().container}>
      <View style={{ alignItems: 'center', paddingHorizontal: '10%' }}>
        <Option title="Clientes" icon="account" path="/components/screens/ClientsScreen" />
        <Option title="Productos" icon="cart" path="/components/screens/ProductsScreen" />
        <Divider style={{ width: '100%' }} /> 
        <Option title="Mis Datos" icon="email" path="/components/screens/UserScreen" />
      </View>
      <Divider style={{ width: '100%', marginVertical: 10 }} />
      <Button mode="contained" icon="power" style={{ backgroundColor: 'red' }} onPress={signOut} >Cerrar Sesión</Button>
    </View>
  );
}

const styles = () => StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  connectionState: {
    marginRight: 75,
  },
  button: {
    marginBottom: 5
  }
});