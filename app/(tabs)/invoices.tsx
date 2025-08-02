import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Button, Checkbox, useTheme } from 'react-native-paper';
import { StyleSheet } from 'react-native';

export default function InvoicesScreen() {
  const theme = useTheme();
  return (
    <View style={styles().container}>
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