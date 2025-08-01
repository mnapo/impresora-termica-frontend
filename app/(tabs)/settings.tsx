import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Button, Checkbox, useTheme } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function SettingsScreen() {
  const theme = useTheme();
  const {signOut} = useAuth();
  return (
    <View style={styles().container}>
      <Text style={styles().title}>Settings</Text>
      <Button onPress={signOut} mode="contained">Cerrar sesión</Button>
    </View>
  );
}

const styles = () => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});