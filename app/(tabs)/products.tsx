import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Button, Checkbox, useTheme } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import ProductsScreen from '../components/screens/ProductsScreen';

export default function ProductsTab() {
  const theme = useTheme();
  return (
    <View style={styles().container}>
      <ProductsScreen />
    </View>
  );
}

const styles = () => StyleSheet.create({
  container: {
    flex: 1,
    padding: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});