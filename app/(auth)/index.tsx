// screens/LoginScreen.js
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput, Button, Text, Checkbox } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [passwordShown, setPasswordShown] = useState(false);

  const handleLogin = async () => {
    try {
      await signIn(email, password);
    } catch (e) {
      setError("Credenciales incorrectas");
    }
  };

  const handlePasswordShown = () => {setPasswordShown(!passwordShown)}

  return (
    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'white' }} >
      <View style={styles().container}>
        <Text>Email</Text>
        <TextInput mode="outlined" value={email} onChangeText={setEmail} autoCapitalize="none" activeOutlineColor='#429E9D' style={{ backgroundColor: 'white' }} />
        <Text>Contraseña</Text>
        <TextInput mode="outlined" value={password} onChangeText={setPassword} secureTextEntry={!passwordShown} autoCapitalize="none" activeOutlineColor='#429E9D' style={{ backgroundColor: 'white' }} />
        <Button icon="eye" mode="text" onPress={handlePasswordShown} labelStyle={{ color: '#429E9D' }} >{passwordShown?'ocultar contraseña':'mostrar contraseña'}</Button>
        <Button style={styles().button} mode="contained" onPress={handleLogin}>Entrar</Button>
        {error && <Text style={{ color: "red" }}>{error}</Text>}
      </View>
    </View>
  );
}

const styles = () => StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 40,
    paddingRight: 40,
    marginVertical: '30%',
    backgroundColor: 'white'
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 15,
    backgroundColor: '#429E9D',
  },
});