import React, { useState, useEffect } from "react";
import { View, FlatList, TouchableOpacity } from "react-native";
import { Text, Searchbar, List, ActivityIndicator, Checkbox, Button, Divider } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { productsActions } from '../store/products';

type Item = {
  id: string;
  code: string;
  name: string;
  price1: number;
  price2: number;
  price3: number;
};

type ProductToItem = {
  id: string;
  code: string;
  name: string;
  price: number;
};

type ItemSelectorProps = {
  pricesList: string;
  invoiceType: any;
  onSelectMany: (items: ProductToItem[]) => void;
};

export default function ItemSelector({ pricesList, invoiceType, onSelectMany }: ItemSelectorProps) {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state: any) => state.products);

  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Item[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 1000;
  const totalPages = Math.ceil(results.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedItems = results.slice(startIndex, endIndex);

  useEffect(() => {
    dispatch(productsActions.fetchAction({ paginate: false }));
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setResults(items);
    } else {
      const q = searchQuery.toLowerCase();
      setResults(
        items.filter(
          (i: Item) =>
            i.name.toLowerCase().includes(q) ||
            i.code.toLowerCase().includes(q)
        )
      );
    }
    setCurrentPage(1);
  }, [searchQuery, items]);

  const addTaxesByType = (price: number) => {
    if (invoiceType === 'arca') {
      return price;
    } else {
      return parseFloat((price + price * 0.21).toFixed(2));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const copy = new Set(prev);
      if (copy.has(id)) {
        copy.delete(id);
      } else {
        copy.add(id);
      }
      return copy;
    });
  };

  const confirmSelection = () => {
    const selectedProducts = results.filter(p => selectedIds.has(p.id)).map(p => ({
      id: p.id,
      code: p.code,
      name: p.name,
      price: pricesList === "list1"
        ? addTaxesByType(p.price1)
        : pricesList === "list2"
        ? addTaxesByType(p.price2)
        : addTaxesByType(p.price3),
    }));
    onSelectMany(selectedProducts);
    setSelectedIds(new Set());
  };

  return (
    <View style={{ height: '100%' }}>
      <Searchbar
        placeholder="Buscar producto..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={{ margin: 8, backgroundColor: 'white', borderColor: 'lightgray', borderWidth: 1, marginHorizontal: 16 }}
      />
      <Text style={{ fontWeight: "bold", marginLeft: 8, marginTop: 4 }}>
        Seleccione producto/s:
      </Text>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 16 }} />
      ) : (
        <>
          <FlatList
            data={paginatedItems}
            keyExtractor={(item) => item.id.toString()}
            style={{ height: '100%' }}
            ItemSeparatorComponent={() => <Divider />}
            renderItem={({ item }) => {
              const price = pricesList === "list1"
                ? addTaxesByType(item.price1)
                : pricesList === "list2"
                ? addTaxesByType(item.price2)
                : addTaxesByType(item.price3);

              const isSelected = selectedIds.has(item.id);

              return (
                <TouchableOpacity onPress={() => toggleSelect(item.id)}>
                  <View style={{ backgroundColor: isSelected ? "#f0f0f0" : "white" }}>
                    <List.Item
                      title={`${item.code} | ${item.name} | $${price}`}
                      left={() => (
                        <Checkbox
                          status={isSelected ? "checked" : "unchecked"}
                          onPress={() => toggleSelect(item.id)}
                        />
                      )}
                    />
                  </View>
                </TouchableOpacity>
              );
            }}
          />
          <Button
            mode="contained"
            style={{ margin: 10 }}
            onPress={confirmSelection}
            disabled={selectedIds.size === 0}
          >
            Confirmar selección
          </Button>
        </>
      )}
    </View>
  );
}
