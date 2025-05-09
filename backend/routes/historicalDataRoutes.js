const express = require('express');
const router = express.Router();
const historicalDataController = require('../controllers/historicalDataController');

// Fetch historical data for a symbol
router.get('/historical', historicalDataController.getHistoricalData);

module.exports = router;
