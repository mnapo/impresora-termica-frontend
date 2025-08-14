// components/ClientSelector.tsx
import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { TextInput, List, ActivityIndicator } from 'react-native-paper';
import client from '../feathersClient'; // Ajustar según tu estructura

type ClientSelectorProps = {
  onSelect: (client: any) => void;
};

export default function ClientSelector({ onSelect }: ClientSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const clientsService = client.service("clients");

  useEffect(() => {
    let active = true;

    const fetchClients = async () => {
      setLoading(true);
      try {
        const res = await clientsService.find({
          query: searchQuery
            ? { name: { $like: `%${searchQuery}%` } }
            : {},
        });
        if (active) setClients(res.data || []);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
      setLoading(false);
    };

    fetchClients();

    return () => {
      active = false;
    };
  }, [searchQuery]);

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        label="Buscar cliente"
        value={searchQuery}
        onChangeText={setSearchQuery}
        mode="outlined"
        style={{ margin: 8 }}
      />

      {loading ? (
        <ActivityIndicator style={{ marginTop: 16 }} />
      ) : (
        <FlatList
          data={clients}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => onSelect(item)}>
              <List.Item
                title={item.address}
                description={item.cuit}
                left={(props) => <List.Icon {...props} icon="account" />}
              />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}