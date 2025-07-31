import { useUnistyles } from 'react-native-unistyles';

import { Stack } from 'expo-router';

export default function Layout() {
  const { theme } = useUnistyles();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTitleStyle: {
          color: theme.colors.typography,
        },
        headerTintColor: theme.colors.typography,
      }}
    />
  );
}
