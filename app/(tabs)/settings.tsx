import React from 'react';
import { useRouter } from 'expo-router'
import { View } from 'react-native';
import { Button, TextInput, Chip, Icon, Divider, FAB } from 'react-native-paper';
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
      <Divider style={{ marginVertical: 10 }} />
      <TextInput label="CUIT" keyboardType="numeric" style={{ marginBottom: 1 }} />
      <TextInput label="Razón Social" style={{ marginBottom: 1 }} />
      <TextInput label="Dirección" keyboardType="numeric" style={{ marginBottom: 1 }} />
      <TextInput label="CBU" keyboardType="numeric" style={{ marginBottom: 1 }} />
      <TextInput label="Alias" style={{ marginBottom: 1 }} />
      <FAB icon="power" color="red" label="Cerrar Sesión" style={{position: 'absolute', bottom: '1%', left: '62%'}} onPress={signOut} />
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