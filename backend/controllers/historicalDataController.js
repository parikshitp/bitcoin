const { getHistoricalData } = require('../services/historicalDataService');

exports.getHistoricalData = async (req, res) => {
  const { symbol, interval, limit } = req.query; // Parameters: symbol, interval, limit
  try {
    const data = await getHistoricalData(symbol, interval, limit);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send('Error fetching historical data');
  }
};
