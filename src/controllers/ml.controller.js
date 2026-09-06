const mlService = require("../services/ml.service");

const getMLHealth = async (req, res) => {
  try {
    const result = await mlService.checkMLService();

    res.status(200).json(result);
  } catch (error) {
    res.status(503).json({
      success: false,
      message: "ML service unavailable",
      error: error.message
    });
  }
};

const getDemandForecast = async (req, res) => {
  try {
    const result = await mlService.forecastDemand(req.body);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Demand forecasting failed",
      error: error.message
    });
  }
};

const getWorkforceAllocation = async (req, res) => {
  try {
    const result = await mlService.allocateWorkforce(req.body);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Workforce allocation failed",
      error: error.message
    });
  }
};

const getWorkforcePlan = async (req, res) => {
  try {
    const result = await mlService.planWorkforce(req.body);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Workforce planning failed",
      error: error.message
    });
  }
};

module.exports = {
  getMLHealth,
  getDemandForecast,
  getWorkforceAllocation,
  getWorkforcePlan
};