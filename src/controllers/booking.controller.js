const Booking = require("../models/Booking");
const Service = require("../models/Service");
const { findMatchingWorkers } = require("../services/matching.service");

// Create a booking
const createBooking = async (req, res) => {
  try {
    const {
      service,
      scheduledDate,
      address,
      location,
      description,
    } = req.body;

    // Validate required fields
    if (
      !service ||
      !scheduledDate ||
      !address ||
      !location ||
      !location.coordinates
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Service, scheduled date, address and location are required",
      });
    }

    // Validate coordinates
    if (
      !Array.isArray(location.coordinates) ||
      location.coordinates.length !== 2
    ) {
      return res.status(400).json({
        success: false,
        message: "Location coordinates must be [longitude, latitude]",
      });
    }

    // Validate scheduled date
    const bookingDate = new Date(scheduledDate);

    if (isNaN(bookingDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid scheduled date",
      });
    }

    if (bookingDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Scheduled date must be in the future",
      });
    }

    // Check service
    const serviceExists = await Service.findOne({
      _id: service,
      isActive: true,
    });

    if (!serviceExists) {
      return res.status(404).json({
        success: false,
        message: "Service not found or inactive",
      });
    }

    // Find matching workers
    const matchingWorkers = await findMatchingWorkers(
      location,
      serviceExists.category,
      10
    );

    const matchedWorker =
      matchingWorkers.length > 0 ? matchingWorkers[0] : null;

    // Create booking
    // Price is taken from the service in the database,
    // not from the frontend.
    const booking = await Booking.create({
      customer: req.user._id,
      worker: matchedWorker ? matchedWorker.user._id : null,
      service,
      scheduledDate: bookingDate,
      address,
      location,
      description: description || "",
      price: serviceExists.basePrice,
      status: "pending",
    });

    // Populate booking data
    const populatedBooking = await Booking.findById(booking._id)
      .populate("customer", "name email phone")
      .populate("worker", "name email phone")
      .populate(
        "service",
        "name category description basePrice estimatedDuration"
      );

    res.status(201).json({
      success: true,
      message: matchedWorker
        ? "Booking created and worker matched successfully"
        : "Booking created successfully. No matching worker is currently available.",
      matchingWorkerFound: !!matchedWorker,
      booking: populatedBooking,
    });
  } catch (error) {
    console.error("Create booking error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create booking",
      error: error.message,
    });
  }
};


// Get customer's bookings
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      customer: req.user._id,
    })
      .populate("worker", "name email phone")
      .populate(
        "service",
        "name category description basePrice estimatedDuration"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get my bookings error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};


// Get bookings assigned to worker
const getWorkerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      worker: req.user._id,
    })
      .populate("customer", "name email phone")
      .populate(
        "service",
        "name category description basePrice estimatedDuration"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get worker bookings error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch worker bookings",
      error: error.message,
    });
  }
};


// Get booking by ID
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("customer", "name email phone")
      .populate("worker", "name email phone")
      .populate(
        "service",
        "name category description basePrice estimatedDuration"
      );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const userId = req.user._id.toString();

    const customerId = booking.customer
      ? booking.customer._id.toString()
      : null;

    const workerId = booking.worker
      ? booking.worker._id.toString()
      : null;

    if (customerId !== userId && workerId !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this booking",
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("Get booking error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch booking",
      error: error.message,
    });
  }
};


// Accept booking
const acceptBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Booking cannot be accepted because its status is ${booking.status}`,
      });
    }

    if (
      booking.worker &&
      booking.worker.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "This booking is assigned to another worker",
      });
    }

    booking.worker = req.user._id;
    booking.status = "accepted";

    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate("customer", "name email phone")
      .populate("worker", "name email phone")
      .populate(
        "service",
        "name category description basePrice estimatedDuration"
      );

    res.status(200).json({
      success: true,
      message: "Booking accepted successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Accept booking error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to accept booking",
      error: error.message,
    });
  }
};


// Reject booking
const rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Booking cannot be rejected because its status is ${booking.status}`,
      });
    }

    if (
      booking.worker &&
      booking.worker.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "This booking is assigned to another worker",
      });
    }

    // Remove worker assignment when rejected
    booking.worker = null;
    booking.status = "rejected";

    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate("customer", "name email phone")
      .populate("worker", "name email phone")
      .populate(
        "service",
        "name category description basePrice estimatedDuration"
      );

    res.status(200).json({
      success: true,
      message: "Booking rejected successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Reject booking error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to reject booking",
      error: error.message,
    });
  }
};


// Update booking status
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "accepted",
      "in-progress",
      "completed",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status",
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const userId = req.user._id.toString();

    const customerId = booking.customer.toString();

    const workerId = booking.worker
      ? booking.worker.toString()
      : null;

    const isCustomer = customerId === userId;
    const isWorker = workerId === userId;

    if (!isCustomer && !isWorker) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this booking",
      });
    }

    // Customer can only cancel a booking
    if (isCustomer) {
      if (status !== "cancelled") {
        return res.status(403).json({
          success: false,
          message: "Customer can only cancel a booking",
        });
      }

      if (["completed", "cancelled"].includes(booking.status)) {
        return res.status(400).json({
          success: false,
          message: `Booking cannot be cancelled because its status is ${booking.status}`,
        });
      }
    }

    // Worker can update work progress
    if (isWorker) {
      const validWorkerTransitions = {
        accepted: ["in-progress", "cancelled"],
        "in-progress": ["completed", "cancelled"],
      };

      const allowedNextStatuses =
        validWorkerTransitions[booking.status] || [];

      if (!allowedNextStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Booking cannot be changed from ${booking.status} to ${status}`,
        });
      }
    }

    booking.status = status;

    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate("customer", "name email phone")
      .populate("worker", "name email phone")
      .populate(
        "service",
        "name category description basePrice estimatedDuration"
      );

    res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Update booking status error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update booking status",
      error: error.message,
    });
  }
};


// Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the customer can cancel this booking",
      });
    }

    if (["completed", "cancelled"].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: `Booking cannot be cancelled because its status is ${booking.status}`,
      });
    }

    booking.status = "cancelled";

    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate("customer", "name email phone")
      .populate("worker", "name email phone")
      .populate(
        "service",
        "name category description basePrice estimatedDuration"
      );

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Cancel booking error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to cancel booking",
      error: error.message,
    });
  }
};


module.exports = {
  createBooking,
  getMyBookings,
  getWorkerBookings,
  getBookingById,
  acceptBooking,
  rejectBooking,
  updateBookingStatus,
  cancelBooking,
};