const express = require("express");

const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} = require("../controllers/service.controller");

const protect = require("../middleware/auth.middleware");

const router = express.Router();

// Public APIs
router.get("/", getServices);
router.get("/:id", getServiceById);

// Protected APIs
router.post("/", protect, createService);
router.put("/:id", protect, updateService);
router.delete("/:id", protect, deleteService);

module.exports = router;