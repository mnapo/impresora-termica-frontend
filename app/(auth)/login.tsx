// screens/LoginScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
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
    <View style={{ padding: 20 }}>
      <Text>Email</Text>
      <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" />
      <Text>Contraseña</Text>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Entrar" onPress={handleLogin} />
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
    </View>
  );
}