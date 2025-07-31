import React from 'react';
import { NavigationContainer,  NavigationIndependentTree} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <Stack.Navigator>
      {user ? (
        <Stack.Screen name="🚚 Ticketeador" component={HomeScreen} />
      ) : (
        <Stack.Screen name="Ingreso" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationIndependentTree>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </NavigationIndependentTree>
    </AuthProvider>
  );
}