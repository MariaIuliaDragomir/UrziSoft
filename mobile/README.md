# Agent Commerce - React Native Mobile App

🛍️ **Aplicație mobilă de cumpărături cu AI Agent și plăți Stripe**

Aplicație React Native (Expo) pentru produse locale din România, cu asistent AI conversațional și integrare Stripe pentru plăți.

## 📱 Arhitectură

### Backend (Express.js + Node.js)

- **API REST** pentru produse, chat AI, și checkout
- **Stripe integration** pentru procesarea plăților
- **Port**: 3000

### Frontend (React Native + Expo)

- **Navigation**: React Navigation (Stack)
- **State Management**: Context API (CartContext, ChatContext)
- **Plăți**: @stripe/stripe-react-native
- **Platforme**: iOS, Android, Web

## 🚀 Setup & Instalare

### Prerequisite

```bash
node >= 18.x
npm >= 9.x
expo-cli (instalat global)
```

### 1. Backend Setup

```bash
cd /home/maria_regex/UrziSoft

# Instalează dependențe
npm install

# Configurează .env (dacă nu există)
cp .env.example .env

# Pornește serverul
npm start
```

Backend va rula pe `http://localhost:3000`

### 2. Mobile App Setup

```bash
cd /home/maria_regex/UrziSoft/mobile

# Instalează dependențe
npm install

# Instalează @react-native-async-storage/async-storage
npx expo install @react-native-async-storage/async-storage

# Pornește Expo
npm start
```

### 3. Configurare API URL

**IMPORTANT**: Pentru device real (nu simulator), trebuie să folosești IP-ul local al calculatorului.

Editează `mobile/src/config/index.js`:

```javascript
export const API_BASE_URL = "http://192.168.1.100:3000/api"; // Schimbă cu IP-ul tău
```

Găsește IP-ul tău:

- **Windows**: `ipconfig` (caută IPv4 Address)
- **Mac/Linux**: `ifconfig` sau `ip addr`

## 📂 Structura Proiectului

```
UrziSoft/
├── backend/                    # Backend Express.js
│   ├── server.js
│   ├── config/
│   │   └── stripe.js
│   ├── routes/
│   │   ├── products.js        # GET /api/products/:id, POST /api/products/search
│   │   ├── agent.js           # POST /api/agent/chat
│   │   └── checkout.js        # POST /api/checkout/session, GET /api/checkout/config
│   ├── services/
│   │   ├── productService.js
│   │   ├── agentService.js
│   │   └── stripeService.js
│   └── data/
│       └── products.json
│
└── mobile/                     # React Native App
    ├── App.js                  # Entry point cu Navigation
    ├── app.json                # Expo config
    ├── package.json
    │
    ├── src/
    │   ├── screens/
    │   │   ├── HomeScreen.js         # Listă produse + Chat
    │   │   ├── ProductDetailScreen.js
    │   │   ├── CartScreen.js
    │   │   ├── CheckoutScreen.js
    │   │   └── SuccessScreen.js
    │   │
    │   ├── components/
    │   │   ├── ProductList.js
    │   │   ├── ProductCard.js
    │   │   └── ChatAgent.js
    │   │
    │   ├── context/
    │   │   ├── CartContext.js        # State management coș
    │   │   └── ChatContext.js        # State management chat
    │   │
    │   ├── services/
    │   │   └── api.js                # API client (fetch)
    │   │
    │   └── config/
    │       └── index.js              # Config API_BASE_URL
    │
    └── assets/
```

## 🎯 Features

### ✅ Implementate

1. **🛍️ Catalog Produse**

   - Grid 2 coloane cu imagine, preț, vendor
   - Pull-to-refresh
   - Filtrare dinamică prin chat AI

2. **🤖 AI Shopping Agent**

   - Chat conversațional pentru căutare produse
   - Detectare intenții: categorie, culoare, mărime, oraș, buget
   - Actualizare automată filtre

3. **🛒 Coș de Cumpărături**

   - Adăugare/ștergere produse
   - Selectare mărime
   - Modificare cantitate
   - Persistență în AsyncStorage

4. **💳 Checkout Stripe**

   - Integrare Stripe Payment Sheet
   - Procesare plăți securizată
   - Ecran Success cu confirmare

5. **📱 Navigation**
   - Stack Navigation pentru 5 screens
   - Cart badge în header
   - Deep linking support (Expo)

## 🔧 API Endpoints

### Products

```
POST /api/products/search
Body: { filters: { category, color, size, city, maxPrice } }
Response: { success, products: [...] }

GET /api/products/:id
Response: { success, product: {...} }
```

### AI Agent

```
POST /api/agent/chat
Body: { message, state: { filters } }
Response: { success, reply, filters, newState }
```

### Checkout

```
GET /api/checkout/config
Response: { success, publishableKey }

POST /api/checkout/session
Body: { items: [{ productId, quantity, selectedSize }] }
Response: { success, sessionId }
```

## 🧪 Testing

Backend are teste Jest pentru gateway-ul Stripe:

```bash
cd /home/maria_regex/UrziSoft
npm test
```

## 🚢 Deployment

### Backend (Production)

1. Deploy pe **Railway**, **Render**, sau **Heroku**
2. Setează environment variables:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PUBLISHABLE_KEY`
   - `FRONTEND_URL` (pentru success/cancel redirects)

### Mobile App

1. **Development**: `expo start`
2. **Build APK/IPA**:
   ```bash
   eas build --platform android
   eas build --platform ios
   ```
3. **Publish**: `eas submit`

## 📝 TODO / Îmbunătățiri Viitoare

- [ ] Autentificare utilizatori (Firebase Auth)
- [ ] Istoric comenzi
- [ ] Wishlist / Favorite
- [ ] Notificări push pentru promoții
- [ ] Integrare LLM real (Claude/GPT) pentru AI Agent
- [ ] Multi-language support (EN, RO)
- [ ] Dark mode
- [ ] Analytics (Amplitude, Mixpanel)

## 🐛 Troubleshooting

### "Cannot connect to backend"

- Verifică că backend-ul rulează pe port 3000
- Schimbă `localhost` cu IP-ul local în `mobile/src/config/index.js`
- Verifică că device-ul și calculatorul sunt pe aceeași rețea Wi-Fi

### "Stripe not initialized"

- Verifică că `.env` conține `STRIPE_PUBLISHABLE_KEY`
- Verifică logs în console pentru erori API

### "Module not found"

- Rulează `npm install` în `mobile/`
- Șterge `node_modules` și reinstalează

## 📄 Licență

MIT - Vezi LICENSE file

## 👨‍💻 Autor

**Alx** - Hackathon Stripe Agent Commerce 2024

---

Made with ❤️ for small businesses in România 🇷🇴
