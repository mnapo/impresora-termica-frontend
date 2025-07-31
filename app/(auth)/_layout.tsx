import { AuthProvider, useAuth } from '../context/AuthContext'; // Your auth context
import { Redirect, Stack } from 'expo-router';

function RootLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return <Stack />;
}

export default function App() {
  return (
    <AuthProvider>
      <RootLayout />
    </AuthProvider>
  );
}

// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';

export function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}