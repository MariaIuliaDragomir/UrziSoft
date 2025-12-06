# 🛍️ Stripe Agent Commerce - Ghid Complet

**AI-powered shopping agent pentru small businesses din România**

Proiect hackathon Stripe: "Agentic Commerce: Going Big with Small Businesses"

---

## 📋 CE AI NEVOIE ÎNAINTE SĂ ÎNCEPI

1. **Node.js** (versiunea 16 sau mai mare)
2. **Cont Stripe** (gratuit, test mode)
3. **Browser modern** (Chrome, Firefox, Edge)
4. **Editor de cod** (VSCode recomandat)

---

## 🚀 PAS CU PAS - CUM RULEZI PROIECTUL

### **PAS 1: Verifică Node.js**

Deschide **Terminal** (sau **Command Prompt** pe Windows) și scrie:

```bash
node --version
npm --version
```

Ar trebui să vezi ceva gen `v18.x.x` și `9.x.x`.

**Dacă NU ai Node.js instalat:**
- Mergi la: https://nodejs.org/
- Descarcă versiunea **LTS** (Long Term Support)
- Instalează-l
- Restart terminal-ul
- Verifică din nou cu comenzile de mai sus

---

### **PAS 2: Extrage proiectul**

1. Descarcă fișierul ZIP
2. Extrage-l într-un folder (ex: `C:\proiecte\stripe-agent-commerce` sau `~/Desktop/stripe-agent-commerce`)
3. Deschide Terminal și navighează în folderul proiectului:

```bash
# Pe Windows:
cd C:\proiecte\stripe-agent-commerce

# Pe Mac/Linux:
cd ~/Desktop/stripe-agent-commerce
```

---

### **PAS 3: Instalează dependențele**

În Terminal, în folderul proiectului, rulează:

```bash
npm install
```

**Durează 1-2 minute**. Ar trebui să vezi un progres bar și la final un mesaj de succes.

**Ce face?** Descarcă toate librăriile necesare (Express, Stripe, etc.) în folderul `node_modules/`.

---

### **PAS 4: Configurare Stripe (IMPORTANT!)**

#### **4.1. Creează cont Stripe:**
1. Mergi la: https://dashboard.stripe.com/register
2. Înregistrează-te (gratuit)
3. **Activează TEST MODE** (switch în colțul stânga-sus, trebuie să fie pe TEST)

#### **4.2. Obține cheile Stripe:**
1. În Stripe Dashboard, mergi la: https://dashboard.stripe.com/test/apikeys
2. Copiază:
   - **Secret key** (începe cu `sk_test_...`)
   - **Publishable key** (începe cu `pk_test_...`)

#### **4.3. Creează fișierul `.env`:**

În folderul proiectului, ai un fișier `.env.example`. Trebuie să faci o copie și să-l numești `.env`:

**Pe Windows (în Command Prompt):**
```bash
copy .env.example .env
```

**Pe Mac/Linux (în Terminal):**
```bash
cp .env.example .env
```

#### **4.4. Editează fișierul `.env`:**

Deschide fișierul `.env` cu un editor de text (Notepad, VSCode, etc.) și completează:

```env
STRIPE_SECRET_KEY=sk_test_PUNE_CHEIA_TA_SECRETA_AICI
STRIPE_PUBLISHABLE_KEY=pk_test_PUNE_CHEIA_TA_PUBLICA_AICI
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**IMPORTANT:** Înlocuiește `PUNE_CHEIA_TA_SECRETA_AICI` și `PUNE_CHEIA_TA_PUBLICA_AICI` cu cheile tale de la Stripe!

**Salvează fișierul!**

---

### **PAS 5: Pornește serverul**

În Terminal, în folderul proiectului:

```bash
npm start
```

**SAU, dacă vrei auto-reload la modificări:**

```bash
npm run dev
```

Ar trebui să vezi ceva gen:

```
╔══════════════════════════════════════════════════════╗
║                                                      ║
║   🚀 Stripe Agent Commerce Server                   ║
║                                                      ║
║   Server: http://localhost:3000                      ║
║   API:    http://localhost:3000/api                  ║
║                                                      ║
║   Ready for hackathon! 💪                           ║
║                                                      ║
╚══════════════════════════════════════════════════════╝
```

**Lasă terminalul deschis!** Serverul rulează în background.

---

### **PAS 6: Deschide aplicația în browser**

Deschide browser-ul (Chrome, Firefox, Edge) și mergi la:

```
http://localhost:3000
```

**Ar trebui să vezi:**
- **Stânga:** Grid cu produse de la small businesses
- **Dreapta:** Chat cu AI Agent
- **Sus:** Logo + buton de coș

---

## 🎮 CUM TESTEZI APLICAȚIA

### **Test 1: Chat cu Agentul**

În chat-ul din dreapta, scrie:

```
vreau un tricou portocaliu
```

**Ce ar trebui să se întâmple:**
1. Agentul îți răspunde și te întreabă detalii (mărime, buget, oraș)
2. Produsele din stânga se actualizează automat
3. Vezi doar tricouri portocalii

### **Test 2: Adaugă în coș**

1. Click pe un produs sau pe butonul "Adaugă în coș"
2. Butonul se schimbă în "✓ Adăugat!"
3. Count-ul de la coș (sus-dreapta) crește

### **Test 3: Vezi coșul**

1. Click pe butonul 🛒 (sus-dreapta)
2. Se deschide un modal cu produsele tale
3. Vezi totalul

### **Test 4: Checkout Stripe** (CEL MAI IMPORTANT!)

1. Asigură-te că ai produse în coș
2. Click pe "Plătește cu Stripe"
3. **Ești redirecționat la Stripe Checkout**
4. Folosește card de test Stripe:
   - **Card number:** `4242 4242 4242 4242`
   - **Expiry:** orice dată viitoare (ex: `12/34`)
   - **CVC:** orice 3 cifre (ex: `123`)
   - **Email:** orice email valid
5. Click "Pay"
6. **Ești redirecționat înapoi** la pagina de success! ✅

---

## ❌ PROBLEME COMUNE & SOLUȚII

### **Problema 1: `npm: command not found`**
**Soluție:** Node.js nu e instalat. Vezi PAS 1.

### **Problema 2: `Error: Cannot find module 'express'`**
**Soluție:** Dependențele nu sunt instalate. Rulează `npm install`.

### **Problema 3: `Error: Stripe secret key required`**
**Soluție:** Fișierul `.env` lipsește sau e greșit configurat. Vezi PAS 4.

### **Problema 4: Pagina nu se încarcă în browser**
**Soluție:** 
- Verifică dacă serverul rulează (vezi terminal-ul)
- Verifică URL-ul: `http://localhost:3000` (nu `https://`)

### **Problema 5: "Stripe nu este inițializat"**
**Soluție:**
- Verifică cheia publică în `.env`
- Deschide Console în browser (F12) și vezi erori

### **Problema 6: Produsele nu se actualizează**
**Soluție:**
- Deschide Console în browser (F12)
- Vezi dacă sunt erori la API calls
- Verifică că backend-ul rulează

---

## 🔍 CUM VERIFICI DACĂ TOTUL FUNCȚIONEAZĂ

### **Checklist rapid:**

✅ **Backend pornit:**
```bash
# În terminal ar trebui să vezi:
Server: http://localhost:3000
```

✅ **Frontend se încarcă:**
- Mergi la `http://localhost:3000`
- Vezi produse în stânga
- Vezi chat în dreapta

✅ **API funcționează:**
- Deschide în browser: `http://localhost:3000/api/health`
- Ar trebui să vezi JSON: `{"status":"ok",...}`

✅ **Stripe configurată:**
- Scrie ceva în chat
- Produsele se actualizează
- Coșul funcționează
- Checkout redirect la Stripe

---

## 📂 STRUCTURA PROIECTULUI

```
stripe-agent-commerce/
├── backend/                    # Server Node.js
│   ├── config/
│   │   └── stripe.js          # Config Stripe
│   ├── data/
│   │   └── products.json      # Bază de date produse
│   ├── routes/
│   │   ├── products.js        # API produse
│   │   ├── agent.js           # API agent
│   │   └── checkout.js        # API Stripe
│   ├── services/
│   │   ├── productService.js  # Logică produse
│   │   ├── agentService.js    # Logică AI
│   │   └── stripeService.js   # Logică Stripe
│   └── server.js              # Entry point server
├── frontend/                   # Client-side
│   ├── css/
│   │   └── styles.css         # Design complet
│   ├── js/
│   │   ├── api.js             # API calls
│   │   ├── products.js        # UI produse
│   │   ├── chat.js            # UI chat
│   │   ├── cart.js            # UI coș + Stripe
│   │   └── app.js             # Entry point
│   ├── index.html             # Pagina principală
│   └── success.html           # Pagina de success
├── package.json               # Dependențe
├── .env                       # Config (CREAT DE TINE!)
└── README.md                  # Acest fișier
```

---

## 🔧 EXTENSII VSCODE RECOMANDATE

Dacă folosești VSCode, instalează:

1. **ESLint** - pentru linting JavaScript
2. **Prettier** - pentru formatare cod
3. **Live Server** - pentru preview
4. **Path Intellisense** - autocomplete paths
5. **Thunder Client** - testare API

---

## 🎯 DEMO PENTRU JURIU

**Scenariul perfect:**

1. **Deschizi aplicația** → Arăți layout-ul
2. **Scrii în chat:** "vreau un tricou portocaliu mărime M"
3. **Arăți cum se actualizează** produsele automat
4. **Adaugi 2-3 produse** în coș
5. **Deschizi coșul** → arăți totalul
6. **Click pe Checkout** → redirect la Stripe
7. **Plătești cu card test** → success! ✅

**Timp estimat demo:** 2-3 minute

---

## 📞 SUPORT

**Dacă ceva nu merge:**

1. Verifică console-ul din browser (F12 → Console)
2. Verifică terminalul unde rulează serverul
3. Citește mesajele de eroare cu atenție
4. Compară cu pașii din acest README

**Majoritatea problemelor sunt:**
- `.env` greșit configurat
- `npm install` nu a rulat
- Portul 3000 e ocupat (schimbă în `.env` la alt port)

---

## 🚀 NEXT STEPS (Post-Hackathon)

- [ ] Integrare **Claude API / GPT** pentru agent real
- [ ] **Stripe Connect** pentru split payments
- [ ] **Webhooks** pentru confirmare comenzi
- [ ] **Admin Dashboard** pentru vendori
- [ ] **Deploy** pe Vercel / Railway

---

## 🎉 GATA!

Proiectul tău e complet și gata de hackathon! 

**Mult succes! 💪🇷🇴**

---

*Creat cu ❤️ pentru Stripe Hackathon 2024*
