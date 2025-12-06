// mobile/src/screens/SuccessScreen.js
// Ecran succes după plată

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';

export default function SuccessScreen({ navigation, route }) {
  const { sessionId } = route.params || {};

  // Animație simplă
  const scaleAnim = new Animated.Value(0);

  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.checkmark}>✓</Text>
        <Text style={styles.title}>Comandă plasată cu succes!</Text>
        <Text style={styles.message}>
          Mulțumim pentru comandă! 🎉
        </Text>
        <Text style={styles.submessage}>
          Vei primi un email de confirmare în câteva momente.
        </Text>

        {sessionId && (
          <View style={styles.sessionBox}>
            <Text style={styles.sessionLabel}>ID sesiune:</Text>
            <Text style={styles.sessionId}>{sessionId.substring(0, 20)}...</Text>
          </View>
        )}

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            ✨ Ai susținut afacerile locale din România!
          </Text>
          <Text style={styles.infoText}>
            📦 Vei primi detalii despre livrare prin email.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.homeButtonText}>🏠 Înapoi la produse</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  checkmark: {
    fontSize: 80,
    color: '#4CAF50',
    marginBottom: 24,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  submessage: {
    fontSize: 14,
    color: '#999',
    marginBottom: 24,
    textAlign: 'center',
  },
  sessionBox: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    width: '100%',
  },
  sessionLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  sessionId: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#333',
  },
  infoBox: {
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
    width: '100%',
  },
  infoText: {
    fontSize: 14,
    color: '#2E7D32',
    marginBottom: 4,
  },
  homeButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
