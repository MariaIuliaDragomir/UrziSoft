// mobile/App.js
// Entry point pentru aplicația React Native

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StripeProvider } from "@stripe/stripe-react-native";
import { CartProvider } from "./src/context/CartContext";
import { ChatProvider } from "./src/context/ChatContext";

// Screens
import HomeScreen from "./src/screens/HomeScreen";
import ProductDetailScreen from "./src/screens/ProductDetailScreen";
import CartScreen from "./src/screens/CartScreen";
import CheckoutScreen from "./src/screens/CheckoutScreen";
import SuccessScreen from "./src/screens/SuccessScreen";

// Configuration
import { STRIPE_PUBLISHABLE_KEY } from "./src/config";

const Stack = createStackNavigator();

export default function App() {
  return (
    <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
      <CartProvider>
        <ChatProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Home"
              screenOptions={{
                headerStyle: {
                  backgroundColor: "#FF6B35",
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                  fontWeight: "bold",
                },
              }}
            >
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{
                  title: "🛍️ Agent Commerce",
                  headerRight: () => <CartButton />,
                }}
              />
              <Stack.Screen
                name="ProductDetail"
                component={ProductDetailScreen}
                options={{ title: "Detalii Produs" }}
              />
              <Stack.Screen
                name="Cart"
                component={CartScreen}
                options={{ title: "Coșul Meu" }}
              />
              <Stack.Screen
                name="Checkout"
                component={CheckoutScreen}
                options={{ title: "Finalizare Comandă" }}
              />
              <Stack.Screen
                name="Success"
                component={SuccessScreen}
                options={{
                  title: "Comandă Plasată!",
                  headerLeft: null, // Nu permite înapoi
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </ChatProvider>
      </CartProvider>
    </StripeProvider>
  );
}

// Cart button component pentru header
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useCart } from "./src/context/CartContext";

function CartButton() {
  const navigation = useNavigation();
  const { cart } = useCart();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <TouchableOpacity
      style={styles.cartButton}
      onPress={() => navigation.navigate("Cart")}
    >
      <Text style={styles.cartIcon}>🛒</Text>
      {itemCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{itemCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cartButton: {
    marginRight: 15,
    position: "relative",
  },
  cartIcon: {
    fontSize: 24,
  },
  badge: {
    position: "absolute",
    right: -8,
    top: -8,
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});
