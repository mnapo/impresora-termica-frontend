import { Icon } from 'react-native-paper';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
      <Tabs initialRouteName='index' backBehavior='initialRoute'>
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Icon
              source={focused ? 'home' : 'home-outline'}
              size={focused ? 55 : 42}
              color={focused ? 'purple' : 'black'}
            />
          )
        }}
      />
      <Tabs.Screen
        name="invoices"
        options={{
          title: "Facturas",
          tabBarShowLabel: false,
            tabBarIcon: ({ focused, color, size }) => (
              <Icon
                source={focused ? 'plus-circle' : 'plus-circle-outline'}
                size={focused ? 55 : 42}
                color={focused ? 'purple' : 'black'}
              />
            )
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Configuración",
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Icon
              source={focused ? 'cog' : 'cog-outline'}
              size={focused ? 55 : 42}
              color={focused ? 'purple' : 'black'}
            />
          )
        }}
      />
    </Tabs>
  );
}