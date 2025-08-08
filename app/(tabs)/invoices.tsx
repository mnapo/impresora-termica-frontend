import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Button, Checkbox, useTheme } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import InvoicesScreen from '../components/screens/InvoicesScreen';

export default function InvoicesTab() {
  const theme = useTheme();
  return (
    <View style={styles().container}>
      <InvoicesScreen />
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