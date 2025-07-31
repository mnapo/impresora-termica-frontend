import React from 'react';
import { NavigationContainer,  NavigationIndependentTree} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from '../context/AuthContext';
import LoginScreen from '../(tabs)/LoginScreen';
import ScreensTabs from '../(tabs)/ScreensTabs';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <Stack.Navigator>
      {user ? (
        <Stack.Screen name="🚚 Ticketeador" component={ScreensTabs} />
      ) : (
        <Stack.Screen name="Ingreso" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator/>
    </AuthProvider>
  );
}