const express = require("express");
const router = express.Router();

const {
  createCooperative,
  getAllCooperatives,
  getCooperativeById,
  updateCooperative,
  deleteCooperative,
  getFederationSocieties,
  getCooperativeWorkers,
  assignWorkerToCooperative,
  removeWorkerFromCooperative,
} = require("../controllers/cooperative.controller");

const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

// All cooperative routes require authentication
router.use(protect);

// ======================================
// ADMIN ROUTES
// ======================================

// Create federation / society
router.post(
  "/",
  authorizeRoles("admin"),
  createCooperative
);

// Get all cooperatives
router.get(
  "/",
  authorizeRoles("admin"),
  getAllCooperatives
);

// Get workers belonging to a cooperative
router.get(
  "/:id/workers",
  authorizeRoles("admin"),
  getCooperativeWorkers
);

// Assign worker to cooperative
router.post(
  "/:id/workers",
  authorizeRoles("admin"),
  assignWorkerToCooperative
);

// Remove worker from cooperative
router.delete(
  "/:id/workers/:workerId",
  authorizeRoles("admin"),
  removeWorkerFromCooperative
);

// Get societies under federation
router.get(
  "/:id/societies",
  authorizeRoles("admin"),
  getFederationSocieties
);

// Update cooperative
router.patch(
  "/:id",
  authorizeRoles("admin"),
  updateCooperative
);

// Deactivate cooperative
router.delete(
  "/:id",
  authorizeRoles("admin"),
  deleteCooperative
);

// ======================================
// GENERAL AUTHENTICATED ROUTE
// ======================================

// Get cooperative details
router.get("/:id", getCooperativeById);

module.exports = router;