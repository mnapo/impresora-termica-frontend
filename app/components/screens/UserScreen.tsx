import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Divider } from "react-native-paper";
import { Stack } from "expo-router";
import { useAuth } from '../../context/AuthContext';

export default function UserScreen() {
  const { user } = useAuth();
  const [userEmail, setUserEmail] = useState('');
  const [userCompanyName, setUserCompanyName] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [userCbu, setUserCbu] = useState('');
  const [userAlias, setUserAlias] = useState('');

  useEffect(() => {
    setUserEmail(user.email || '');
    setUserCompanyName(user.companyName || '');
    setUserAddress(user.address || '');
    setUserCbu(user.cbu || '');
    setUserAlias(user.alias || '');
  }, [user]);

  return (<>
    <Stack.Screen options={{ title: "Mis Datos" }}/>
    <View style={ styles.container } >
      <TextInput value={userEmail} onChangeText={text => setUserEmail(text)} label="Correo" disabled={true} style={ styles.input } activeUnderlineColor='#429E9D' />
      <TextInput value={userCompanyName} onChangeText={text => setUserCompanyName(text)} disabled={true} label="Razón Social" style={ styles.input } activeUnderlineColor='#429E9D' />
      <TextInput value={userAddress} onChangeText={text => setUserAddress(text)} label="Dirección" keyboardType="numeric" style={ styles.input } activeUnderlineColor='#429E9D' />
      <TextInput value={userCbu} onChangeText={text => setUserCbu(text)} label="CBU" keyboardType="numeric" style={ styles.input } activeUnderlineColor='#429E9D' />
      <TextInput value={userAlias} onChangeText={text => setUserAlias(text)} label="Alias" style={ styles.input } activeUnderlineColor='#429E9D' />
      <Divider style={{ marginVertical: 10 }} />
    </View>
  </>);
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    width: '100%',
    backgroundColor: 'white'
  },
  input: {
    marginBottom: 8,
    backgroundColor: 'white'
  }
});