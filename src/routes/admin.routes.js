const express = require("express");

const {
  getDashboardStats,
} = require("../controllers/admin.controller");

const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorizeRoles("admin"));

// Admin dashboard statistics
router.get("/dashboard", getDashboardStats);

module.exports = router;