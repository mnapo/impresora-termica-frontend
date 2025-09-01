import React, { useState, useEffect } from "react";
import { View, FlatList, TouchableOpacity } from "react-native";
import { Text, TextInput, List, ActivityIndicator, Button } from "react-native-paper";
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
  onSelect: (item: ProductToItem) => void;
};

export default function ItemSelector({ pricesList, invoiceType, onSelect }: ItemSelectorProps) {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state: any) => state.products);

  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Item[]>([]);

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

  return (
    <View style={{ height: '100%' }}>
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
        <>
          <FlatList
            data={paginatedItems}
            keyExtractor={(item) => item.id.toString()}
            style={{ height: '100%' }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  onSelect({
                    id: item.id,
                    code: item.code,
                    name: item.name,
                    price:
                      pricesList === "list1"
                        ? addTaxesByType(item.price1)
                        : pricesList === "list2"
                        ? addTaxesByType(item.price2)
                        : addTaxesByType(item.price3),
                  })
                }
              >
                <List.Item
                  title={`${item.code} | ${item.name} | $${pricesList==='list1'?addTaxesByType(item.price1):pricesList==='list2'?addTaxesByType(item.price2):addTaxesByType(item.price3)}`}
                  left={(props) => <List.Icon {...props} icon="cart-outline" />}
                />
              </TouchableOpacity>
            )}
          />
        </>
      )}
    </View>
  );
}