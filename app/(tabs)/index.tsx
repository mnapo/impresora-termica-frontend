import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { View } from 'react-native';
import { PaperProvider, Portal, Modal, Text, Chip, Button, Divider, Icon } from 'react-native-paper';
import Option from '../components/Option'
import InvoiceOption from '../components/InvoiceOption'

export default function TabsHome() {
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  const handlePress = ( type: string ) => {
    setVisible(false);
    router.push({
        pathname: '/components/screens/NewInvoiceScreen',
        params: { type: type },
    });
  };

  return (<PaperProvider><Portal>
    <Modal visible={visible} onDismiss={ () => { setVisible(false) } } contentContainerStyle={styles.modal}>
      <Button mode="contained" onPress={() => handlePress('arca') } icon="file" style={{ marginVertical: 5}} uppercase={true} labelStyle={{ fontSize: 24 }} buttonColor='black' textColor='white' >factura ARCA</Button>
      <Chip ellipsizeMode='tail' icon={() => (
        <Icon source="circle" size={16} color="yellow" />
      )}>crear una factura ARCA genera un CAE único</Chip>
      <Button mode="contained" onPress={() => handlePress('comprobante') } icon="content-paste" style={{ marginVertical: 5}} uppercase={true} labelStyle={{ fontSize: 24 }} buttonColor='black' textColor='white' >comprobante</Button>
      <Button mode="outlined" onPress={() => setVisible(false) } icon="window-close" style={{ marginVertical: 5}} uppercase={true} labelStyle={{ fontSize: 24 }} textColor='black' >Cerrar</Button>
    </Modal>
  </Portal>
  <View style={styles.container}>
    <Text style={styles.title2}><Icon source="account-outline" size={32}/>{user.lastName.toUpperCase()} {user.firstName.toUpperCase()}👋</Text>
    <Divider style={styles.divider} />
    <View style={{ alignItems: 'center', paddingHorizontal: '10%' }}>
      <InvoiceOption title="Nuevo Comprobante" onOpenModal={() => setVisible(true)} />
      <Option title="Comprobantes" icon="book-multiple" path="/components/screens/InvoicesScreen" />
      <Option title="Métricas" icon="chart-areaspline" path="" />
    </View>
  </View>
  </PaperProvider>);
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title1: {
    fontSize: 20,
  },
  title2: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  divider: {
    marginVertical: 10,
  },
  button: {
    marginVertical: 5
  },
  modal: {
    backgroundColor: 'white', padding: 20
  },
});