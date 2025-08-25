import React from 'react';
import { useRouter } from 'expo-router'
import { View } from 'react-native';
import { Button, Chip, Icon, Divider } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import Option from '../components/Option'

export default function SettingsScreen() {
  const {signOut} = useAuth();

  return (
    <View style={styles().container}>
      <Chip style={styles().connectionState} icon={() => (
        <Icon source="circle" size={16} color="green" />
      )}>conexión ARCA establecida</Chip>
      <View style={{ alignItems: 'center', paddingHorizontal: '10%' }}>
        <Option title="Clientes" icon="account" path="/components/screens/ClientsScreen" />
        <Option title="Productos" icon="cart" path="/components/screens/ProductsScreen" />
      </View>
      <Divider style={{ marginVertical: 10 }}/>
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