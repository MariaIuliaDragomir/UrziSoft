// mobile/src/components/ProductCard.js
// Card produs pentru grid

import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");
const cardWidth = (width - 32) / 2; // 2 coloane cu padding

export default function ProductCard({ product, onPress }) {
  const price = (product.price / 100).toFixed(2);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Image source={{ uri: product.image }} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>

        <Text style={styles.vendor} numberOfLines={1}>
          👤 {product.vendorName}
        </Text>

        <Text style={styles.city} numberOfLines={1}>
          📍 {product.city}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.price}>
            {price} {product.currency}
          </Text>
          <Text style={styles.badge}>✨</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 6,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: "100%",
    height: cardWidth * 0.8,
    resizeMode: "cover",
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
    height: 36, // 2 linii fixe
  },
  vendor: {
    fontSize: 11,
    color: "#666",
    marginBottom: 2,
  },
  city: {
    fontSize: 11,
    color: "#666",
    marginBottom: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF6B35",
  },
  badge: {
    fontSize: 16,
  },
});
