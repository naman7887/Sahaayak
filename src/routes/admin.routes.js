const express = require("express");

const {
  getDashboardStats,
  getWorkers,
  updateWorkerVerification,
} = require("../controllers/admin.controller");

const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorizeRoles("admin"));

// Admin dashboard
router.get("/dashboard", getDashboardStats);

// Worker management
router.get("/workers", getWorkers);
router.patch("/workers/:id/verification", updateWorkerVerification);

module.exports = router;