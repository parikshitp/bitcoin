const WebSocket = require('ws');

let binanceSocket = null;

// This is the WebSocket server handling real-time trade data
exports.startBinanceSocket = (symbol) => {
  // The WebSocket URL for Binance
  const binanceSocketUrl = `wss://stream.binance.com:9443/ws/${symbol}@trade`;

  // If a WebSocket connection exists, close it
  if (binanceSocket) {
    binanceSocket.close();
  }

  // Create a new WebSocket connection for the provided symbol
  binanceSocket = new WebSocket(binanceSocketUrl);

  // When the WebSocket is open, log the connection
  binanceSocket.on('open', () => {
    console.log(`Connected to Binance WebSocket stream for ${symbol}`);
  });

  // Handle incoming WebSocket messages
  binanceSocket.on('message', (message) => {
    const parsedData = JSON.parse(message);

    // Extract relevant trade data
    const trade = {
      price: parsedData.p,      // Price of the trade
      quantity: parsedData.q,   // Quantity of the trade
      timestamp: parsedData.T,  // Timestamp of the trade
    };

    // Broadcast the trade data to all connected clients
    global.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(trade)); // Send the trade data to the client
      }
    });
  });

  binanceSocket.on('close', () => {
    console.log(`Disconnected from Binance WebSocket stream for ${symbol}`);
  });
};

// Close the WebSocket connection
exports.closeBinanceSocket = () => {
  if (binanceSocket) {
    binanceSocket.close();
    console.log('WebSocket connection closed');
  }
};
