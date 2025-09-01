// components/ClientSelector.tsx
import React, { useState, useEffect } from "react";
import { View, FlatList, TouchableOpacity } from "react-native";
import { Text, Searchbar, List, ActivityIndicator } from "react-native-paper";
import client from "../feathersClient";

type Client = {
  id: string;
  cuit: string;
  companyName: string;
  address: string;
};

type ClientSelectorProps = {
  onSelect: (client: Client) => void;
};

export default function ClientSelector({ onSelect }: ClientSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Client[]>([]);

  const clientsService = client.service("clients");

  useEffect(() => {
    let active = true;
    const fetchClients = async () => {
      setLoading(true);
      try {
        const res = await clientsService.find({});
        if (active) {
          setClients(res.data || []);
          setResults(res.data || []);
        }
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
      setLoading(false);
    };
    fetchClients();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setResults(clients);
    } else {
      const q = searchQuery.toLowerCase();
      const filtered = clients.filter(
        (c) =>
          c.companyName.toLowerCase().includes(q) ||
          c.cuit.toLowerCase().includes(q) ||
          c.address.toLowerCase().includes(q)
      );
      setResults(filtered);
    }
  }, [searchQuery, clients]);

  return (
    <View>
      <Searchbar
        placeholder="Buscar cliente..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={{ margin: 8, backgroundColor: 'white', borderColor: 'lightgray', borderWidth: 1, marginHorizontal: 16 }}
      />
      <Text style={{ fontWeight: "bold", marginLeft: 8, marginTop: 4 }}>
        Seleccione un cliente:
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
                title={item.companyName}
                description={`${item.cuit} - ${item.address}`}
                left={(props) => <List.Icon {...props} icon="account" />}
              />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}