const {
  checkMLService,
  forecastDemand,
  allocateWorkforce,
} = require("../services/ml.service");

// CHECK ML SERVICE
// Admin only
const getMLHealth = async (req, res) => {
  try {
    const result = await checkMLService();

    if (!result.available) {
      return res.status(503).json({
        success: false,
        message: "ML service is currently unavailable",
      });
    }

    return res.status(200).json({
      success: true,
      message: "ML service is available",
      data: result.data,
    });
  } catch (error) {
    console.error("ML health check error:", error);

    return res.status(503).json({
      success: false,
      message: "ML service is unavailable",
    });
  }
};

// DEMAND FORECAST
// Admin only
const getDemandForecast = async (req, res) => {
  try {
    const {
      city,
      state,
      service,
      date,
      days,
    } = req.body;

    if (!city || !service) {
      return res.status(400).json({
        success: false,
        message: "City and service are required",
      });
    }

    const payload = {
      city,
      state: state || "",
      service,
      date: date || new Date().toISOString().split("T")[0],
      days: days || 1,
    };

    const result = await forecastDemand(payload);

    return res.status(200).json({
      success: true,
      message: "Demand forecast generated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Demand forecast error:", error);

    return res.status(503).json({
      success: false,
      message:
        "Unable to generate demand forecast. ML service may be unavailable.",
    });
  }
};

// WORKFORCE ALLOCATION
// Admin only
const getWorkforceAllocation = async (req, res) => {
  try {
    const {
      city,
      state,
      service,
      forecastedDemand,
      availableWorkers,
    } = req.body;

    if (
      !city ||
      !service ||
      forecastedDemand === undefined ||
      !Array.isArray(availableWorkers)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "City, service, forecasted demand and available workers are required",
      });
    }

    const payload = {
      city,
      state: state || "",
      service,
      forecastedDemand: Number(forecastedDemand),
      availableWorkers,
    };

    const result = await allocateWorkforce(payload);

    return res.status(200).json({
      success: true,
      message: "Workforce allocation generated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Workforce allocation error:", error);

    return res.status(503).json({
      success: false,
      message:
        "Unable to generate workforce allocation. ML service may be unavailable.",
    });
  }
};

module.exports = {
  getMLHealth,
  getDemandForecast,
  getWorkforceAllocation,
};