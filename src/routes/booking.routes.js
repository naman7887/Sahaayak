const express = require("express");
const router = express.Router();

const {
  createBooking,
  getMyBookings,
  getWorkerBookings,
  getBookingById,
  acceptBooking,
  rejectBooking,
  updateBookingStatus,
  cancelBooking,
} = require("../controllers/booking.controller");

const protect = require("../middleware/auth.middleware");

// All booking routes require authentication
router.use(protect);

// Customer
router.post("/", createBooking);
router.get("/my", getMyBookings);
router.patch("/:id/cancel", cancelBooking);

// Worker
router.get("/worker", getWorkerBookings);
router.patch("/:id/accept", acceptBooking);
router.patch("/:id/reject", rejectBooking);

// Customer / Worker / Admin
router.get("/:id", getBookingById);
router.patch("/:id/status", updateBookingStatus);

module.exports = router;