const express = require('express');
const WebSocket = require('ws');
const cors = require('cors');
const bodyParser = require('body-parser');
const websocketRoutes = require('./routes/websocketRoutes');
const historicalDataRoutes = require('./routes/historicalDataRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// WebSocket server for real-time data
const wss = new WebSocket.Server({ port: 4001 });

let binanceSocket = null;  // Declare binanceSocket globally

// This function creates a Binance WebSocket connection for the given symbol
function createBinanceSocket(symbol) {
  // Ensure the symbol is in lowercase



  const formattedSymbol = symbol.toLowerCase();

  // Create a new Binance WebSocket URL for real-time trade data (e.g., BTC/USDT)
  const binanceSocketUrl = `wss://stream.binance.com:9443/ws/${formattedSymbol}@trade`;

  // If a previous WebSocket connection exists, close it
  if (binanceSocket) {
    binanceSocket.close();
  }

  // Create a new WebSocket connection to Binance for the new symbol
  binanceSocket = new WebSocket(binanceSocketUrl);

  // When the Binance WebSocket connection is open, log it
  binanceSocket.on('open', () => {
    console.log('Connected to Binance WebSocket stream for:', formattedSymbol);
  });

  // Event handler when the Binance WebSocket stream sends a message
  binanceSocket.on('message', (message) => {
    const parsedData = JSON.parse(message);

    // Extract the relevant trade information
    const trade = {
      price: parsedData.p, // price
      quantity: parsedData.q, // quantity
      timestamp: parsedData.T // timestamp
    };

    // Broadcast the parsed trade data to all connected WebSocket clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        // Send the trade data as a JSON string to the client
        client.send(JSON.stringify(trade));
      }
    });
  });

  binanceSocket.on('close', () => {
    console.log('Disconnected from Binance WebSocket stream for:', formattedSymbol);
  });
}

// Event handler when a client connects to your WebSocket server
wss.on('connection', (ws) => {
  console.log('A new client connected.');
  // Event handler when the client sends a message (i.e., the crypto pair)
  ws.on('message', (message) => {

    if (message && message.length > 0) {
      const messageStr = message.toString(); // Convert Buffer to string

      console.log('Received from client:', messageStr);
      createBinanceSocket(messageStr); // Create or update WebSocket for new symbol
    } else {
      console.error('Received invalid or empty message:', message);
    }
  });
});

// Routes for APIs
app.use('/api/websocket', websocketRoutes);
app.use('/api/data', historicalDataRoutes);

// Start the Express server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
