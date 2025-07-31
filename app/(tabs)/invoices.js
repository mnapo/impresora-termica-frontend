import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Button, Checkbox, useTheme } from 'react-native-paper';
import { StyleSheet } from 'react-native';

export default function InvoicesScreen() {
  const theme = useTheme();

  return (
    <View style={styles(theme).container}>
      <Text style={styles(theme).title}>Invoicess</Text>
    </View>
  );
}

const styles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 1,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.onBackground,
  },
});