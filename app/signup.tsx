import { Stack, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Container } from '~/components/Container';
import { SignupForm } from '~/components/SignupForm';

export default function Signup() {
  const { name } = useLocalSearchParams();

  return (
    <>
      <Stack.Screen options={{ title: 'Registro' }} />
      <Container>
        <View style={styles.container}>
          <Text style={styles.title}>Crear cuenta</Text>
          <View style={styles.separator} />
          <SignupForm/>
        </View>
      </Container>
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 1,
    backgroundColor: theme.colors.background,
  },
  separator: {
    height: 1,
    width: '80%',
    backgroundColor: theme.colors.limedSpruce,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.typography,
  },
}));