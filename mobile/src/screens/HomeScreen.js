// mobile/src/screens/HomeScreen.js
// Ecran principal: listă produse + chat AI

import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import ProductList from "../components/ProductList";
import ChatAgent from "../components/ChatAgent";
import { useChat } from "../context/ChatContext";
import { searchProducts } from "../services/api";

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { filters } = useChat();

  useEffect(() => {
    loadProducts();
  }, [filters]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const results = await searchProducts(filters);
      setProducts(results);
    } catch (error) {
      console.error("Eroare la încărcarea produselor:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadProducts();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={styles.container}>
        {/* Lista de produse - 60% din ecran */}
        <View style={styles.productsContainer}>
          <ProductList
            products={products}
            loading={loading}
            refreshing={refreshing}
            onRefresh={onRefresh}
            onProductPress={(product) =>
              navigation.navigate("ProductDetail", { product })
            }
          />
        </View>

        {/* Chat Agent - 40% din ecran */}
        <View style={styles.chatContainer}>
          <ChatAgent />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  productsContainer: {
    flex: 0.6,
    borderBottomWidth: 2,
    borderBottomColor: "#FF6B35",
  },
  chatContainer: {
    flex: 0.4,
    backgroundColor: "#fff",
  },
});
