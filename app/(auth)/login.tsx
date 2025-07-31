// screens/LoginScreen.js
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput, Button, Text, Divider } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      await signIn(email, password);
    } catch (e) {
      console.error('Login error:', e);
    }
  };

  return (
    <View style={styles().container}>
      <Text style={styles().title}>Iniciar Sesión</Text>
      <Divider/>
      <Text>Email</Text>
      <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" />
      <Text>Contraseña</Text>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry />
      <Button mode="contained" onPress={handleLogin}>Entrar</Button>
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
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