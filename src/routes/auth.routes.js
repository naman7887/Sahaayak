const express = require("express");

const router = express.Router();

const {
    register,
    login,
    getMe
} = require("../controllers/auth.controller");

const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

// ==============================
// AUTH ROUTES
// ==============================

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Get current logged-in user
router.get("/me", protect, getMe);

// ==============================
// TEMPORARY ROLE TEST ROUTE
// ==============================

// Worker-only test route
router.get(
    "/worker-test",
    protect,
    authorizeRoles("worker"),
    (req, res) => {
        res.status(200).json({
            success: true,
            message: "Worker-only route accessed successfully"
        });
    }
);

module.exports = router;