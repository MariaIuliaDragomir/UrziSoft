// mobile/src/screens/CheckoutScreen.js
// Ecran finalizare plată cu Stripe

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import { useCart } from "../context/CartContext";
import { createCheckoutSession } from "../services/api";

export default function CheckoutScreen({ navigation }) {
  const { cart, getTotal, clearCart } = useCart();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const total = (getTotal() / 100).toFixed(2);

  const handlePayment = async () => {
    setLoading(true);

    try {
      // 1. Creăm sesiunea de checkout pe backend
      const sessionId = await createCheckoutSession(cart);

      // 2. Inițializăm Payment Sheet
      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: "Agent Commerce",
        paymentIntentClientSecret: sessionId,
        defaultBillingDetails: {
          name: "Client Agent Commerce",
        },
      });

      if (initError) {
        Alert.alert("Eroare", initError.message);
        setLoading(false);
        return;
      }

      // 3. Afișăm Payment Sheet
      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        Alert.alert("Plată anulată", presentError.message);
        setLoading(false);
        return;
      }

      // 4. Succes! Golim coșul și navigăm la Success
      clearCart();
      navigation.replace("Success", { sessionId });
    } catch (error) {
      console.error("Eroare checkout:", error);
      Alert.alert(
        "Eroare la procesarea plății",
        error.message || "Te rog încearcă din nou!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Finalizare comandă</Text>

        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Sumar comandă:</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Produse:</Text>
            <Text style={styles.summaryValue}>{cart.length} buc</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal:</Text>
            <Text style={styles.summaryValue}>{total} RON</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total de plată:</Text>
            <Text style={styles.totalValue}>{total} RON</Text>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            🔒 Plata este procesată securizat prin Stripe
          </Text>
          <Text style={styles.infoText}>
            ✨ Suportai afacerile locale din România!
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.payButton, loading && styles.payButtonDisabled]}
          onPress={handlePayment}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.payButtonText}>💳 Plătește {total} RON</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Înapoi la coș</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 24,
  },
  summaryBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  totalValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF6B35",
  },
  infoBox: {
    backgroundColor: "#FFF4E6",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  payButton: {
    backgroundColor: "#FF6B35",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
  },
});
