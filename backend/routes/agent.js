// backend/routes/agent.js
// Endpoint pentru conversația cu AI Agent

const express = require('express');
const router = express.Router();
const { processMessage } = require('../services/agentService');

/**
 * POST /api/agent/message
 * Body: { message: "vreau un tricou portocaliu", state: {...} }
 * Response: { reply: "...", filters: {...}, newState: {...} }
 */
router.post('/message', (req, res) => {
  try {
    const { message, state } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Mesajul este obligatoriu'
      });
    }
    
    // Procesăm mesajul prin agent
    const result = processMessage(message, state || {});
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Eroare la procesarea mesajului:', error);
    res.status(500).json({
      success: false,
      error: 'Eroare la procesarea mesajului',
      reply: 'Ne pare rău, am întâmpinat o eroare. Te rog încearcă din nou!'
    });
  }
});

module.exports = router;
