import React from 'react';
import { Text } from 'react-native';
import { StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import InvoicesScreen from './InvoicesScreen';
import SettingsScreen from './SettingsScreen';

const Tab = createBottomTabNavigator();

export default function ScreensTabs() {
  const { user, signOut } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Inicio") {
            iconName = focused ? "🏠" : "🏡";
          } else if (route.name === "Cuenta") {
            iconName = focused ? "⚙️" : "🔧";
          }
          return <Text style={{ color: color, fontSize: size }}>{iconName}</Text>;
        },
        tabBarActiveTintColor: "purple",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Inicio" component={InvoicesScreen} />
      <Tab.Screen name="Cuenta" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});