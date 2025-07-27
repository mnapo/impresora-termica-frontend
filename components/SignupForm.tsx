import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Button, TextInput } from 'react-native-paper';

export const SignupForm = () => {
  return (
    <View style={styles.container}>
      <TextInput label="Email"/>
      <TextInput label="CUIT"/>
      <TextInput label="Clave Fiscal"/>
      <TextInput label="Nombre"/>
      <TextInput label="Apellido"/>
      <Button mode="contained">Registrarme</Button>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 1,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.typography,
  },
}));
