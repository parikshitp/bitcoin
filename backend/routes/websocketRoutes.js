const express = require('express');
const router = express.Router();
const websocketController = require('../controllers/websocketController');

// Start WebSocket connection for a specific symbol
router.post('/start', websocketController.startWebSocket);

// Stop WebSocket connection
router.post('/stop', websocketController.stopWebSocket);

module.exports = router;
