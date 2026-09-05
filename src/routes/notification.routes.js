const express = require("express");

const {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
} = require("../controllers/notification.controller");

const protect = require("../middleware/auth.middleware");

const router = express.Router();

// All notification routes require authentication
router.use(protect);

// Get current user's notifications
router.get("/", getMyNotifications);

// Mark all notifications as read
router.patch("/read-all", markAllAsRead);

// Mark one notification as read
router.patch("/:id/read", markAsRead);

module.exports = router;