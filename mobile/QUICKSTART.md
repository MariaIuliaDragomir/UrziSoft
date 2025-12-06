# Agent Commerce Mobile - Quick Start

## Pornire Rapidă

### 1. Backend

```bash
cd /home/maria_regex/UrziSoft
npm start
```

Backend va rula pe http://localhost:3000

### 2. Mobile App

```bash
cd /home/maria_regex/UrziSoft/mobile

# Instalează dependențe (prima dată)
npm install
npx expo install @react-native-async-storage/async-storage

# Pornește Expo
npm start
```

### 3. Configurare IP (IMPORTANT pentru device real)

Editează `mobile/src/config/index.js` și schimbă:

```javascript
export const API_BASE_URL = "http://192.168.1.XXX:3000/api";
// Înlocuiește cu IP-ul tău local
```

Găsește IP-ul:

- Windows: `ipconfig`
- Mac/Linux: `ifconfig`

### 4. Rulare

- **Simulator iOS**: Apasă `i` în Expo CLI
- **Emulator Android**: Apasă `a` în Expo CLI
- **Device fizic**: Scanează QR code cu Expo Go app

## Features

✅ Catalog produse locale
✅ AI Shopping Agent (chat)
✅ Coș de cumpărături
✅ Stripe Checkout
✅ Navigation 5 screens

## Probleme comune

**"Cannot connect to backend"**
→ Verifică IP-ul în config/index.js

**"Stripe not initialized"**
→ Verifică .env în backend

**Module not found**
→ `cd mobile && npm install`
