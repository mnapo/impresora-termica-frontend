import { Icon } from 'react-native-paper';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
      <Tabs initialRouteName='index' backBehavior='initialRoute'>
      <Tabs.Screen
        name="index"
        options={{
          title: "",
              tabBarIcon: ({ focused, color, size }) => (
                <Icon
                  source={focused ? 'home' : 'home-outline'}
                  size={40}
                  color={'purple'}
                />
              )
        }}
      />
      <Tabs.Screen
        name="invoices"
        options={{
          title: "",
              tabBarIcon: ({ focused, color, size }) => (
                <Icon
                  source={focused ? 'plus-circle' : 'plus-circle-outline'}
                  size={40}
                  color={'purple'}
                />
              )
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "",
              tabBarIcon: ({ focused, color, size }) => (
                <Icon
                  source={focused ? 'cog' : 'cog-outline'}
                  size={40}
                  color={'purple'}
                />
              )
        }}
      />
    </Tabs>
  );
}