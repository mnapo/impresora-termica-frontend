import React, { useState, useEffect } from "react";
import { View, FlatList, TouchableOpacity } from "react-native";
import { Text, TextInput, List, ActivityIndicator } from "react-native-paper";
import client from "../feathersClient";

type Item = {
  id: string;
  code: string;
  name: string;
  price: number;
};

type ItemSelectorProps = {
  onSelect: (item: Item) => void;
};

export default function ItemSelector({ onSelect }: ItemSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Item[]>([]);

  const itemsService = client.service("products");

  useEffect(() => {
    let active = true;
    const fetchItems = async () => {
      setLoading(true);
      try {
        const res = await itemsService.find({});
        if (active) {
          setItems(res.data || []);
          setResults(res.data || []);
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      }
      setLoading(false);
    };
    fetchItems();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setResults(items);
    } else {
      const q = searchQuery.toLowerCase();
      const filtered = items.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.code.toLowerCase().includes(q)
      );
      setResults(filtered);
    }
  }, [searchQuery, items]);

  return (
    <View>
      <TextInput
        label="Ingrese Código o Nombre del producto"
        value={searchQuery}
        onChangeText={setSearchQuery}
        mode="outlined"
        style={{ margin: 8 }}
      />
      <Text style={{ fontWeight: "bold", marginLeft: 8, marginTop: 4 }}>
        Seleccione un producto:
      </Text>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 16 }} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => onSelect(item)}>
              <List.Item
                title={`${item.code} - ${item.name}`}
                description={`$${item.price}`}
                left={(props) => <List.Icon {...props} icon="cart-outline" />}
              />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}