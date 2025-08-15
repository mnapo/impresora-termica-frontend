import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { TextInput, List, ActivityIndicator } from 'react-native-paper';
import client from '../feathersClient'; // Ajustar según tu estructura

type ItemSelectorProps = {
  onSelect: (item: any) => void;
};

export default function ItemSelector({ onSelect }: ItemSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const itemsService = client.service("products");

  useEffect(() => {
    let active = true;

    const fetchItems = async () => {
      setLoading(true);
      try {
        const res = await itemsService.find({
          query: searchQuery
            ? { name: { $like: `%${searchQuery}%` } }
            : {},
        });
        if (active) setItems(res.data || []);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
      setLoading(false);
    };

    fetchItems();

    return () => {
      active = false;
    };
  }, [searchQuery]);

  return (
    <View>
      <TextInput
        label="Ingrese Código o nombre del producto"
        value={searchQuery}
        onChangeText={setSearchQuery}
        mode="outlined"
        style={{ margin: 8 }}
      />

      {loading ? (
        <ActivityIndicator style={{ marginTop: 16 }} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => onSelect(item)}>
              <List.Item
                title={item.name}
                description={item.price}
                left={(props) => <List.Icon {...props} icon="account" />}
              />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}