import React from 'react';
import { View } from 'react-native';
import { Button, Chip, Icon } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function SettingsScreen() {
  const {signOut} = useAuth();
  return (
    <View style={styles().container}>
      <Chip style={styles().connectionState} icon={() => (
        <Icon source="circle" size={16} color="green" />
      )}>conexión ARCA establecida</Chip>
      <Button onPress={signOut} mode="contained">Cerrar sesión</Button>
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
  }
});