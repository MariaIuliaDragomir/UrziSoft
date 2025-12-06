// mobile/src/context/CartContext.js
// Context global pentru gestionarea coșului de cumpărături

import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Încarcă coșul din storage la pornire
  useEffect(() => {
    loadCart();
  }, []);

  // Salvează coșul când se modifică
  useEffect(() => {
    saveCart();
  }, [cart]);

  const loadCart = async () => {
    try {
      const saved = await AsyncStorage.getItem("@agent_commerce_cart");
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Eroare la încărcarea coșului:", error);
    }
  };

  const saveCart = async () => {
    try {
      await AsyncStorage.setItem("@agent_commerce_cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Eroare la salvarea coșului:", error);
    }
  };

  const addToCart = (product, selectedSize = "M") => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) =>
          item.productId === product.id && item.selectedSize === selectedSize
      );

      if (existingItem) {
        return prevCart.map((item) =>
          item.productId === product.id && item.selectedSize === selectedSize
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [
          ...prevCart,
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            vendorName: product.vendorName,
            vendorId: product.vendorId,
            selectedSize,
            quantity: 1,
          },
        ];
      }
    });
  };

  const removeFromCart = (productId, selectedSize) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          !(item.productId === productId && item.selectedSize === selectedSize)
      )
    );
  };

  const updateQuantity = (productId, selectedSize, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedSize);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId && item.selectedSize === selectedSize
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
