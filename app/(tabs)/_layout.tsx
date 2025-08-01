import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="invoices" options={{ title: 'invoices' }} />
      <Tabs.Screen name="settings" options={{ title: 'settings' }} />
    </Tabs>
  );
}