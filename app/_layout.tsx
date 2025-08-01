import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppLayout() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return (
    <>
      <Stack>
        <Stack.Protected guard={!isAuthenticated}>
          <Stack.Screen name="(auth)" options={{ title: "🚚Ticketeador", headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen name="(tabs)" options={{ title: "🚚Ticketeador" }}/>
        </Stack.Protected>
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  );
}