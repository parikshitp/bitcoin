const { startBinanceSocket, closeBinanceSocket } = require('../services/websocketService');

exports.startWebSocket = (req, res) => {
  const { symbol } = req.body;  // The symbol (e.g., 'btcusdt')
  
  // Create the WebSocket connection
  try {
    startBinanceSocket(symbol);  // Start the Binance WebSocket for the given symbol
    res.status(200).send(`Started WebSocket for ${symbol}`);
  } catch (error) {
    res.status(500).send('Error starting WebSocket');
  }
};

exports.stopWebSocket = (req, res) => {
  try {
    closeBinanceSocket();
    res.status(200).send('WebSocket connection closed');
  } catch (error) {
    res.status(500).send('Error stopping WebSocket');
  }
};
