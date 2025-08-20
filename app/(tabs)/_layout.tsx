import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: () => <FontAwesome size={45} name="home" color="purple" />,
          tabBarActiveTintColor: "purple",
        }}
      />
      <Tabs.Screen
        name="clients"
        options={{
          title: "Clientes",
          tabBarIcon: () => <FontAwesome size={45} name="id-card-o" color="purple" />,
          tabBarActiveTintColor: "purple",
        }}
      />
      <Tabs.Screen
        name="invoices"
        options={{
          title: "Documentos",
          tabBarIcon: () => <FontAwesome size={60} name="paperclip" color="purple" />,
          tabBarActiveTintColor: "purple",
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: "Productos",
          tabBarIcon: () => <FontAwesome size={45} name="shopping-cart" color="purple" />,
          tabBarActiveTintColor: "purple",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Cuenta",
          tabBarIcon: () => <FontAwesome size={45} name="cog" color="purple" />,
          tabBarActiveTintColor: "purple",
        }}
      />
    </Tabs>
  );
}