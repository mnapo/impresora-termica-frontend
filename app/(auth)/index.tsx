// screens/LoginScreen.js
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput, Button, Text, Divider, Checkbox } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      await signIn(email, password);
    } catch (e) {
      setError("Credenciales incorrectas");
    }
  };

  return (
    <View style={styles().container}>
      <Text style={styles().title}>Iniciar Sesión</Text>
      <Divider/>
      <Text>Email</Text>
      <TextInput mode="outlined" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <Text>Contraseña</Text>
      <TextInput mode="outlined" value={password} onChangeText={setPassword} secureTextEntry />
      <Button style={styles().button} mode="contained" onPress={handleLogin}>Entrar</Button>
      {error && <Text style={{ color: "red" }}>{error}</Text>}
      <Checkbox.Item label="Recordarme" status="checked" disabled={true} />
    </View>
  );
}

const styles = () => StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 40,
    paddingRight: 40,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 15,
  },
});