import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Button, Checkbox, TextInput } from 'react-native-paper';
import { StyleSheet } from 'react-native-unistyles';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn } = useAuth();
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      await signIn(email, password);
    } catch (e) {
      setError("Credenciales incorrectas");
    }
  };

  return (
    <View style={styles.container}>
      <Text>Email</Text>
      <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" />
      <Text>Contraseña</Text>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry />
      <Button onPress={handleLogin}>Entrar</Button>
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
    </View>
  );
}

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
