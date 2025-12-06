// mobile/src/screens/CartScreen.js
// Ecran coș de cumpărături

import React from "react";
import {
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useCart } from "../context/CartContext";

export default function CartScreen({ navigation }) {
  const { cart, removeFromCart, updateQuantity, getTotal } = useCart();

  const total = (getTotal() / 100).toFixed(2);

  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert("Coș gol", "Adaugă produse înainte de a plăti!");
      return;
    }
    navigation.navigate("Checkout");
  };

  const handleRemove = (item) => {
    Alert.alert("Șterge produs", `Sigur vrei să ștergi ${item.name}?`, [
      { text: "Anulează", style: "cancel" },
      {
        text: "Șterge",
        style: "destructive",
        onPress: () => removeFromCart(item.productId, item.selectedSize),
      },
    ]);
  };

  if (cart.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🛒</Text>
        <Text style={styles.emptyTitle}>Coșul tău este gol</Text>
        <Text style={styles.emptyText}>Adaugă produse locale din România!</Text>
        <TouchableOpacity
          style={styles.shopButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.shopButtonText}>🛍️ Continuă cumpărăturile</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {cart.map((item, index) => (
          <CartItem
            key={`${item.productId}-${item.selectedSize}-${index}`}
            item={item}
            onRemove={() => handleRemove(item)}
            onUpdateQuantity={(qty) =>
              updateQuantity(item.productId, item.selectedSize, qty)
            }
          />
        ))}
      </ScrollView>

      {/* Footer cu total și buton checkout */}
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>{total} RON</Text>
        </View>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handleCheckout}
        >
          <Text style={styles.checkoutButtonText}>🔒 Plătește cu Stripe</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Component pentru un item din coș
function CartItem({ item, onRemove, onUpdateQuantity }) {
  const price = (item.price / 100).toFixed(2);
  const subtotal = ((item.price * item.quantity) / 100).toFixed(2);

  return (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />

      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemVendor}>{item.vendorName}</Text>
        <Text style={styles.itemSize}>Mărime: {item.selectedSize}</Text>
        <Text style={styles.itemPrice}>
          {price} RON × {item.quantity} = {subtotal} RON
        </Text>

        {/* Controale cantitate */}
        <View style={styles.quantityControls}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => onUpdateQuantity(item.quantity - 1)}
          >
            <Text style={styles.quantityButtonText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => onUpdateQuantity(item.quantity + 1)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
        <Text style={styles.removeButtonText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    backgroundColor: "#fff",
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  shopButton: {
    backgroundColor: "#FF6B35",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 12,
    marginVertical: 6,
    padding: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  itemVendor: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  itemSize: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF6B35",
    marginBottom: 8,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  quantityText: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: "600",
  },
  removeButton: {
    padding: 8,
  },
  removeButtonText: {
    fontSize: 20,
  },
  footer: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF6B35",
  },
  checkoutButton: {
    backgroundColor: "#FF6B35",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
