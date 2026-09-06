const express = require("express");
const router = express.Router();

const {
  getMLHealth,
  getDemandForecast,
  getWorkforceAllocation,
} = require("../controllers/ml.controller");

const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

// All ML routes require authentication
router.use(protect);

// ML functionality is currently intended for administrators
router.use(authorizeRoles("admin"));

// Check ML service availability
router.get("/health", getMLHealth);

// AI demand forecasting
router.post("/forecast", getDemandForecast);

// AI workforce allocation
router.post("/allocate", getWorkforceAllocation);

module.exports = router;