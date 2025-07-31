import { Redirect, Slot } from 'expo-router';
import { useAuth } from './context/AuthContext';

export default function RootLayout() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Slot />;
  }

  return <Slot />;
}