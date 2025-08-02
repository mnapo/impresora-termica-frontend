import React from 'react';
import { StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { View } from 'react-native';
import { Text, Divider } from 'react-native-paper';

export default function TabsHome() {
  const { user } = useAuth();
  return (
    <View style={styles().container}>
      <Text style={styles().title2}>{user.email} 👋</Text>
      <Divider style={styles().divider} />
      <Text style={styles().title1}>Último cliente visitado</Text>
      <Text>Sin datos</Text>
    </View>
  );
}
const styles = () => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  title1: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  title2: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 10,
  },
});