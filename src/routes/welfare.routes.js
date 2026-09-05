const express = require("express");

const {
  getWelfareSchemes,
  getWelfareSchemeById,
  createWelfareScheme,
  updateWelfareScheme,
  deleteWelfareScheme,
} = require("../controllers/welfare.controller");

const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

const router = express.Router();

// Public APIs
router.get("/", getWelfareSchemes);
router.get("/:id", getWelfareSchemeById);

// Admin-only management APIs
router.post("/", protect, authorizeRoles("admin"), createWelfareScheme);
router.put("/:id", protect, authorizeRoles("admin"), updateWelfareScheme);
router.delete("/:id", protect, authorizeRoles("admin"), deleteWelfareScheme);

module.exports = router;