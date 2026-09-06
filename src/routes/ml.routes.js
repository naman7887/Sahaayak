const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

const {
  getMLHealth,
  getDemandForecast,
  getWorkforceAllocation,
  getWorkforcePlan
} = require("../controllers/ml.controller");


// All ML APIs require admin access
router.use(protect);
router.use(authorizeRoles("admin"));


// Check ML service
router.get("/health", getMLHealth);


// Demand forecasting
router.post("/forecast", getDemandForecast);


// Workforce allocation
router.post("/allocate", getWorkforceAllocation);


// Combined demand forecasting + workforce allocation
router.post("/workforce-plan", getWorkforcePlan);


module.exports = router;