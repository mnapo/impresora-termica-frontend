import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen() {
  const { user, signOut } = useAuth();

  return (
    <View style={{ padding: 20 }}>
      <Text>Bienvenido, {user.email}</Text>
      <Button title="Cerrar sesión" onPress={signOut} />
    </View>
  );
}