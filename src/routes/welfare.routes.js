const express = require("express");

const {
  getWelfareSchemes,
  getWelfareSchemeById,
  createWelfareScheme,
  updateWelfareScheme,
  deleteWelfareScheme,
} = require("../controllers/welfare.controller");

const protect = require("../middleware/auth.middleware");

const router = express.Router();

// Public APIs
router.get("/", getWelfareSchemes);
router.get("/:id", getWelfareSchemeById);

// Protected APIs
router.post("/", protect, createWelfareScheme);
router.put("/:id", protect, updateWelfareScheme);
router.delete("/:id", protect, deleteWelfareScheme);

module.exports = router;