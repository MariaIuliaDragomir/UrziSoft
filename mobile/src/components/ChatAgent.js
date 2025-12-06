// mobile/src/components/ChatAgent.js
// Componenta chat AI Agent

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useChat } from "../context/ChatContext";

export default function ChatAgent() {
  const { messages, isTyping, sendMessage } = useChat();
  const [inputText, setInputText] = useState("");
  const scrollViewRef = useRef();

  useEffect(() => {
    // Auto-scroll la ultimul mesaj
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim()) {
      sendMessage(inputText.trim());
      setInputText("");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.agentAvatar}>
          <Text style={styles.avatarText}>🤖</Text>
        </View>
        <View style={styles.agentInfo}>
          <Text style={styles.agentName}>AI Shopping Agent</Text>
          <View style={styles.statusContainer}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Online</Text>
          </View>
        </View>
      </View>

      {/* Mesaje */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd()}
      >
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {isTyping && (
          <View style={[styles.messageBubble, styles.agentBubble]}>
            <Text style={styles.typingText}>Agent scrie...</Text>
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Scrie ce cauți..."
          placeholderTextColor="#999"
          multiline
          maxLength={500}
          returnKeyType="send"
          onSubmitEditing={handleSend}
          blurOnSubmit={false}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            !inputText.trim() && styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={!inputText.trim()}
        >
          <Text style={styles.sendButtonText}>📤</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function MessageBubble({ message }) {
  const isAgent = message.isAgent;

  return (
    <View
      style={[styles.messageContainer, isAgent && styles.agentMessageContainer]}
    >
      {isAgent && (
        <View style={styles.messageAvatar}>
          <Text style={styles.avatarEmoji}>🤖</Text>
        </View>
      )}

      <View
        style={[
          styles.messageBubble,
          isAgent ? styles.agentBubble : styles.userBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            isAgent ? styles.agentText : styles.userText,
          ]}
        >
          {message.text}
        </Text>
      </View>

      {!isAgent && (
        <View style={styles.messageAvatar}>
          <Text style={styles.avatarEmoji}>👤</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#f9f9f9",
  },
  agentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FF6B35",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
  },
  agentInfo: {
    flex: 1,
  },
  agentName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#4CAF50",
    marginRight: 4,
  },
  statusText: {
    fontSize: 11,
    color: "#666",
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 12,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "flex-end",
  },
  agentMessageContainer: {
    justifyContent: "flex-start",
  },
  messageAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 6,
  },
  avatarEmoji: {
    fontSize: 14,
  },
  messageBubble: {
    maxWidth: "70%",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  agentBubble: {
    backgroundColor: "#f0f0f0",
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: "#FF6B35",
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  agentText: {
    color: "#333",
  },
  userText: {
    color: "#fff",
  },
  typingText: {
    color: "#666",
    fontStyle: "italic",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    backgroundColor: "#fff",
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FF6B35",
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    fontSize: 20,
  },
});
