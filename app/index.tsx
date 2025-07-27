import { Stack } from 'expo-router';

import { StyleSheet } from 'react-native-unistyles';
import { Container } from '~/components/Container';

import { LoginForm } from '~/components/LoginForm';

export default function Welcome() {
  return (
    <>
      <Stack.Screen options={{ title: "🚚 Ticketeador" }} />
      <Container>
        <LoginForm/>
      </Container>
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  button: {
    marginHorizontal: theme.margins.xl,
  },
}));
