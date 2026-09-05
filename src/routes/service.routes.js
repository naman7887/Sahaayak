const express = require("express");

const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} = require("../controllers/service.controller");

const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

const router = express.Router();

// Public APIs
router.get("/", getServices);
router.get("/:id", getServiceById);

// Admin-only service management APIs
router.post("/", protect, authorizeRoles("admin"), createService);
router.put("/:id", protect, authorizeRoles("admin"), updateService);
router.delete("/:id", protect, authorizeRoles("admin"), deleteService);

module.exports = router;