// mobile/src/context/ChatContext.js
// Context pentru chat AI Agent

import React, { createContext, useContext, useState } from "react";
import { sendChatMessage } from "../services/api";

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Bună! 👋 Sunt agentul tău pentru produse locale din România.\n\nSpune-mi ce cauți și te ajut să găsești produse de la micii producători!",
      isAgent: true,
      timestamp: new Date(),
    },
  ]);
  const [filters, setFilters] = useState({ smallBusinessOnly: true });
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async (text) => {
    // Adaugă mesajul utilizatorului
    const userMessage = {
      id: Date.now().toString(),
      text,
      isAgent: false,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Arată "typing..."
    setIsTyping(true);

    try {
      // Trimite mesajul la backend
      const response = await sendChatMessage(text, filters);

      // Adaugă răspunsul agentului
      const agentMessage = {
        id: (Date.now() + 1).toString(),
        text: response.reply,
        isAgent: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, agentMessage]);

      // Actualizează filtrele
      if (response.filters) {
        setFilters(response.filters);
      }
    } catch (error) {
      console.error("Eroare chat:", error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: "Scuze, am întâmpinat o problemă. Te rog încearcă din nou!",
        isAgent: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([messages[0]]); // Păstrează doar mesajul de bun venit
    setFilters({ smallBusinessOnly: true });
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        filters,
        isTyping,
        sendMessage,
        clearChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return context;
}
