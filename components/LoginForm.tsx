import { Link } from 'expo-router';
import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Button, Checkbox, TextInput } from 'react-native-paper';

export const LoginForm = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>
      <TextInput label="Email"/>
      <TextInput label="Clave"/>
      <Button mode="contained">Ingresar</Button>
      <Text><Checkbox status="unchecked"/>Recordarme</Text>
      <Text style={styles.title}>- o ingresar mediante -</Text>
      <Button mode="contained">Google</Button>
      <Text style={styles.title}>- o si no tenés cuenta -</Text>
        <Link href={{ pathname: '/signup' }} asChild>
          <Button mode="contained">Registrate</Button>
        </Link>
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
