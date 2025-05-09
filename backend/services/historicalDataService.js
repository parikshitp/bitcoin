const axios = require('axios');

exports.getHistoricalData = async (symbol, interval = '1m', limit = 1000) => {
  const response = await axios.get('https://api.binance.com/api/v3/klines', {
    params: {
      symbol: symbol,
      interval: interval,
      limit: limit,
    },
  });
  return response.data; // Candlestick data for the given symbol
};
