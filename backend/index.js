// Import the WebSocket library
const WebSocket = require('ws');

// Create a new WebSocket server that listens on port 4000
const wss = new WebSocket.Server({ port: 4000 });

// Store the WebSocket connections by their pair
let binanceSocket = null;

function createBinanceSocket(symbol) {
  // Create a new Binance WebSocket URL for real-time trade data (e.g., BTC/USDT)
  const binanceSocketUrl = `wss://stream.binance.com:9443/ws/${symbol}@trade`;

  // If a previous WebSocket connection exists, close it
  if (binanceSocket) {
    binanceSocket.close();
  }

  // Create a new WebSocket connection to Binance for the new symbol
  binanceSocket = new WebSocket(binanceSocketUrl);

  // When the Binance WebSocket connection is open, log it
  binanceSocket.on('open', () => {
    console.log('Connected to Binance WebSocket stream for:', symbol);
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

    // Broadcast the parsed trade data to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        // Send the trade data as a JSON string to the client
        client.send(JSON.stringify(trade));
      }
    });
  });

  binanceSocket.on('close', () => {
    console.log('Disconnected from Binance WebSocket stream for:', symbol);
  });
}

// Event handler when a client connects to your WebSocket server
wss.on('connection', (ws) => {
  console.log('A new client connected.');

  // Send a welcome message to the newly connected client
  ws.send('Welcome to the WebSocket server!');

  // Event handler when the client sends a message
  ws.on('message', (message) => {
    console.log('Received from client:', message);

    // If the client sends a new cryptocurrency pair, update the WebSocket stream
    const symbol = message.toLowerCase(); // Convert symbol to lowercase
    createBinanceSocket(symbol); // Create a new WebSocket for the new symbol

    // Acknowledge the symbol change
    ws.send(`Now streaming data for ${symbol.toUpperCase()}`);
  });
});

// Log that the WebSocket server is running
console.log('WebSocket server is running on ws://localhost:4000');
