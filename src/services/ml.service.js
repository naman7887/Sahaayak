const axios = require("axios");

const ML_SERVICE_URL =
  process.env.ML_SERVICE_URL || "http://localhost:8000";

// Check ML service availability
const checkMLService = async () => {
  try {
    const response = await axios.get(`${ML_SERVICE_URL}/health`, {
      timeout: 5000,
    });

    return {
      available: true,
      data: response.data,
    };
  } catch (error) {
    return {
      available: false,
      message: "ML service is currently unavailable",
    };
  }
};

// Demand forecasting
const forecastDemand = async (payload) => {
  try {
    const response = await axios.post(
      `${ML_SERVICE_URL}/forecast`,
      payload,
      {
        timeout: 15000,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "ML demand forecasting error:",
      error.message
    );

    throw new Error("Demand forecasting service unavailable");
  }
};

// Workforce allocation
const allocateWorkforce = async (payload) => {
  try {
    const response = await axios.post(
      `${ML_SERVICE_URL}/allocate`,
      payload,
      {
        timeout: 15000,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "ML workforce allocation error:",
      error.message
    );

    throw new Error("Workforce allocation service unavailable");
  }
};

module.exports = {
  checkMLService,
  forecastDemand,
  allocateWorkforce,
};