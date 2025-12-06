// backend/server.js
// Server principal Express cu toate rutele și middleware-ul

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const productsRouter = require('./routes/products');
const agentRouter = require('./routes/agent');
const checkoutRouter = require('./routes/checkout');

const app = express();
const PORT = process.env.PORT || 3000;

// ========== MIDDLEWARE ==========

// CORS: permitem requests de la frontend
app.use(cors());

// Body parsing pentru JSON
app.use(express.json());

// Servim fișierele statice din frontend/
app.use(express.static(path.join(__dirname, '../frontend')));

// Logging simplu pentru debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// ========== ROUTES ==========

app.use('/api/products', productsRouter);
app.use('/api/agent', agentRouter);
app.use('/api/checkout', checkoutRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'Stripe Agent Commerce API is running!'
  });
});

// Fallback: servim index.html pentru toate celelalte route-uri (SPA behavior)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ========== ERROR HANDLING ==========

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// ========== START SERVER ==========

app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════════════════╗
  ║                                                      ║
  ║   🚀 Stripe Agent Commerce Server                   ║
  ║                                                      ║
  ║   Server: http://localhost:${PORT}                      ║
  ║   API:    http://localhost:${PORT}/api                  ║
  ║                                                      ║
  ║   Ready for hackathon! 💪                           ║
  ║                                                      ║
  ╚══════════════════════════════════════════════════════╝
  `);
});
