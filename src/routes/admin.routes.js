const express = require("express");

const {
  getDashboardStats,
  getWorkers,
  updateWorkerVerification,
  getWorkerWelfareDetails,
} = require("../controllers/admin.controller");

const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorizeRoles("admin"));

// ======================================
// ADMIN DASHBOARD
// ======================================

router.get("/dashboard", getDashboardStats);

// ======================================
// WORKER MANAGEMENT
// ======================================

router.get("/workers", getWorkers);

router.patch(
  "/workers/:id/verification",
  updateWorkerVerification
);

// ======================================
// WORKER WELFARE
// ======================================

// Get salary, training, insurance and scheme
// information for a specific worker
router.get(
  "/workers/:workerId/welfare",
  getWorkerWelfareDetails
);

module.exports = router;