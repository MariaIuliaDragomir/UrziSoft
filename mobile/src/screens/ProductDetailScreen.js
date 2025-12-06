// mobile/src/screens/ProductDetailScreen.js
// Detalii produs cu opțiune de adăugare în coș

import React, { useState } from "react";
import {
  View,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useCart } from "../context/CartContext";

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState("M");

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const price = (product.price / 100).toFixed(2);

  const handleAddToCart = () => {
    addToCart(product, selectedSize);
    Alert.alert(
      "Adăugat în coș!",
      `${product.name} (mărime ${selectedSize}) a fost adăugat în coș.`,
      [
        { text: "Continuă cumpărăturile", onPress: () => navigation.goBack() },
        { text: "Vezi coșul", onPress: () => navigation.navigate("Cart") },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.title}>{product.name}</Text>

        <View style={styles.vendorContainer}>
          <Text style={styles.vendorIcon}>👤</Text>
          <Text style={styles.vendorName}>{product.vendorName}</Text>
          <Text style={styles.separator}>•</Text>
          <Text style={styles.city}>📍 {product.city}</Text>
        </View>

        <Text style={styles.price}>
          {price} {product.currency}
        </Text>

        {product.description && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Descriere:</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>
        )}

        {/* Selector mărime */}
        <View style={styles.sizeContainer}>
          <Text style={styles.sizeTitle}>Selectează mărimea:</Text>
          <View style={styles.sizeOptions}>
            {sizes.map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.sizeButton,
                  selectedSize === size && styles.sizeButtonActive,
                ]}
                onPress={() => setSelectedSize(size)}
              >
                <Text
                  style={[
                    styles.sizeText,
                    selectedSize === size && styles.sizeTextActive,
                  ]}
                >
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Buton adaugă în coș */}
        <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
          <Text style={styles.addButtonText}>🛒 Adaugă în coș</Text>
        </TouchableOpacity>

        {/* Informații vendor */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>✨ Produs local</Text>
          <Text style={styles.infoText}>
            Acest produs este făcut cu dragoste de {product.vendorName} din{" "}
            {product.city}. Susții afacerile mici din România! 🇷🇴
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  vendorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  vendorIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  vendorName: {
    fontSize: 14,
    color: "#666",
  },
  separator: {
    marginHorizontal: 8,
    color: "#999",
  },
  city: {
    fontSize: 14,
    color: "#666",
  },
  price: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FF6B35",
    marginBottom: 16,
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  sizeContainer: {
    marginBottom: 24,
  },
  sizeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  sizeOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  sizeButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  sizeButtonActive: {
    borderColor: "#FF6B35",
    backgroundColor: "#FF6B35",
  },
  sizeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  sizeTextActive: {
    color: "#fff",
  },
  addButton: {
    backgroundColor: "#FF6B35",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  infoBox: {
    backgroundColor: "#FFF4E6",
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#FF6B35",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
});
