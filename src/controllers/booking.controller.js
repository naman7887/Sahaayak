const Booking = require("../models/Booking");
const Service = require("../models/Service");
const User = require("../models/User");
const Notification = require("../models/Notification");
const workerSalaryService = require("../services/workerSalary.service");

// Find nearby workers for a service
const findMatchingWorkers = async (location, category, radiusKm = 10) => {
  if (
    !location ||
    !Array.isArray(location.coordinates) ||
    location.coordinates.length !== 2
  ) {
    return [];
  }

  const workers = await User.find({
    role: "worker",
    isActive: true,
    "workerProfile.category": category,
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: location.coordinates,
        },
        $maxDistance: radiusKm * 1000,
      },
    },
  }).select("_id name email phone location workerProfile");

  return workers;
};

// Create booking
exports.createBooking = async (req, res) => {
  try {
    const {
      service,
      scheduledDate,
      address,
      location,
      description,
      price,
      isEmergency = false,
      priority,
    } = req.body;

    if (
      !service ||
      !scheduledDate ||
      !address ||
      !location ||
      !Array.isArray(location.coordinates) ||
      location.coordinates.length !== 2
    ) {
      return res.status(400).json({
        success: false,
        message:
          "service, scheduledDate, address and valid location coordinates are required",
      });
    }

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

    const bookingDate = new Date(scheduledDate);

    if (Number.isNaN(bookingDate.getTime())) {
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

    // Emergency bookings are automatically marked urgent
    const emergencyBooking = Boolean(isEmergency);

    let bookingPriority = priority || "normal";

    if (emergencyBooking) {
      bookingPriority = "urgent";
    }

    if (!["normal", "high", "urgent"].includes(bookingPriority)) {
      return res.status(400).json({
        success: false,
        message: "Invalid priority",
      });
    }

    // Emergency requests search a wider area
    const matchingRadius = emergencyBooking ? 25 : 10;

    const matchingWorkers = await findMatchingWorkers(
      location,
      serviceExists.category,
      matchingRadius
    );

    // For emergency bookings, prefer an available worker if availability
    // information exists. Otherwise fall back to the nearest matched worker.
    let selectedWorker = null;

    if (matchingWorkers.length > 0) {
      selectedWorker =
        matchingWorkers.find(
          (worker) =>
            worker.workerProfile &&
            worker.workerProfile.isAvailable === true
        ) || matchingWorkers[0];
    }

    const booking = await Booking.create({
      customer: req.user._id,
      worker: selectedWorker ? selectedWorker._id : null,
      service,
      scheduledDate: bookingDate,
      address,
      location: {
        type: "Point",
        coordinates: location.coordinates,
      },
      description: description || "",
      price:
        price !== undefined && price !== null
          ? Number(price)
          : serviceExists.price || 0,
      isEmergency: emergencyBooking,
      priority: bookingPriority,
      status: "pending",
    });

    // Notify assigned worker
    if (selectedWorker) {
      await Notification.create({
        recipient: selectedWorker._id,
        title: emergencyBooking
          ? "Emergency Booking Request"
          : "New Booking Request",
        message: emergencyBooking
          ? `You have received an emergency ${serviceExists.name} booking request.`
          : `You have received a new ${serviceExists.name} booking request.`,
        booking: booking._id,
        type: "booking",
      });
    }

    // Notify customer when no worker is immediately available
    if (!selectedWorker) {
      await Notification.create({
        recipient: req.user._id,
        title: emergencyBooking
          ? "Emergency Request Received"
          : "Booking Received",
        message: emergencyBooking
          ? "Your emergency request has been received. We are looking for a nearby worker."
          : "Your booking has been received. We are looking for a suitable worker.",
        booking: booking._id,
        type: "booking",
      });
    }

    const populatedBooking = await Booking.findById(booking._id)
      .populate("customer", "name email phone")
      .populate("worker", "name email phone")
      .populate("service", "name category price");

    return res.status(201).json({
      success: true,
      message: emergencyBooking
        ? "Emergency booking created successfully"
        : "Booking created successfully",
      data: populatedBooking,
      matchingWorkers: matchingWorkers.length,
    });
  } catch (error) {
    console.error("Create booking error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create booking",
      error: error.message,
    });
  }
};

// Get customer's bookings
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      customer: req.user._id,
    })
      .populate("worker", "name email phone")
      .populate("service", "name category price")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error("Get my bookings error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};

// Get worker's bookings
exports.getWorkerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      worker: req.user._id,
    })
      .populate("customer", "name email phone")
      .populate("service", "name category price")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error("Get worker bookings error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch worker bookings",
      error: error.message,
    });
  }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("customer", "name email phone")
      .populate("worker", "name email phone")
      .populate("service", "name category price");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Customer can view their own booking
    // Worker can view bookings assigned to them
    const isCustomer =
      booking.customer &&
      booking.customer._id.toString() === req.user._id.toString();

    const isWorker =
      booking.worker &&
      booking.worker._id.toString() === req.user._id.toString();

    const isAdmin = req.user.role === "admin";

    if (!isCustomer && !isWorker && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this booking",
      });
    }

    return res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error("Get booking error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch booking",
      error: error.message,
    });
  }
};

// Accept booking
exports.acceptBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      worker: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found or not assigned to you",
      });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Booking cannot be accepted because its current status is ${booking.status}`,
      });
    }

    booking.status = "accepted";
    await booking.save();

    await Notification.create({
      recipient: booking.customer,
      title: booking.isEmergency
        ? "Emergency Booking Accepted"
        : "Booking Accepted",
      message: booking.isEmergency
        ? "A worker has accepted your emergency booking request."
        : "A worker has accepted your booking request.",
      booking: booking._id,
      type: "booking",
    });

    const updatedBooking = await Booking.findById(booking._id)
      .populate("customer", "name email phone")
      .populate("worker", "name email phone")
      .populate("service", "name category price");

    return res.status(200).json({
      success: true,
      message: "Booking accepted successfully",
      data: updatedBooking,
    });
  } catch (error) {
    console.error("Accept booking error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to accept booking",
      error: error.message,
    });
  }
};

// Reject booking
exports.rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      worker: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found or not assigned to you",
      });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Booking cannot be rejected because its current status is ${booking.status}`,
      });
    }

    booking.status = "rejected";
    await booking.save();

    await Notification.create({
      recipient: booking.customer,
      title: booking.isEmergency
        ? "Emergency Booking Rejected"
        : "Booking Rejected",
      message: booking.isEmergency
        ? "The assigned worker rejected your emergency request. We will look for another worker."
        : "The assigned worker rejected your booking request.",
      booking: booking._id,
      type: "booking",
    });

    return res.status(200).json({
      success: true,
      message: "Booking rejected successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Reject booking error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reject booking",
      error: error.message,
    });
  }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "accepted",
      "rejected",
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

    const oldStatus = booking.status;

    const isCustomer =
      booking.customer.toString() === req.user._id.toString();

    const isWorker =
      booking.worker &&
      booking.worker.toString() === req.user._id.toString();

    const isAdmin = req.user.role === "admin";

    if (!isCustomer && !isWorker && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this booking",
      });
    }

    // Customers should only be able to cancel
    if (isCustomer && !isAdmin && status !== "cancelled") {
      return res.status(403).json({
        success: false,
        message: "Customers can only cancel bookings",
      });
    }

    // Workers cannot directly cancel customer bookings through status API
    if (isWorker && !isAdmin && status === "cancelled") {
      return res.status(403).json({
        success: false,
        message: "Workers cannot cancel bookings",
      });
    }

    booking.status = status;
    await booking.save();

    // Salary is updated only when a booking actually transitions to completed
    if (oldStatus !== "completed" && status === "completed" && booking.worker) {
      try {
        await workerSalaryService.updateCompletedJobs(booking.worker);
      } catch (salaryError) {
        console.error("Salary update error:", salaryError);
      }
    }

    // Notify the other party about status changes
    let notificationRecipient = null;

    if (isWorker) {
      notificationRecipient = booking.customer;
    } else if (isCustomer && booking.worker) {
      notificationRecipient = booking.worker;
    }

    if (notificationRecipient) {
      await Notification.create({
        recipient: notificationRecipient,
        title: booking.isEmergency
          ? "Emergency Booking Updated"
          : "Booking Status Updated",
        message: booking.isEmergency
          ? `Your emergency booking status is now ${status}.`
          : `Your booking status is now ${status}.`,
        booking: booking._id,
        type: "booking",
      });
    }

    const updatedBooking = await Booking.findById(booking._id)
      .populate("customer", "name email phone")
      .populate("worker", "name email phone")
      .populate("service", "name category price");

    return res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      data: updatedBooking,
    });
  } catch (error) {
    console.error("Update booking status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update booking status",
      error: error.message,
    });
  }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      customer: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (["completed", "cancelled"].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: `Booking cannot be cancelled because its current status is ${booking.status}`,
      });
    }

    booking.status = "cancelled";
    await booking.save();

    if (booking.worker) {
      await Notification.create({
        recipient: booking.worker,
        title: booking.isEmergency
          ? "Emergency Booking Cancelled"
          : "Booking Cancelled",
        message: booking.isEmergency
          ? "An emergency booking assigned to you has been cancelled."
          : "A booking assigned to you has been cancelled.",
        booking: booking._id,
        type: "booking",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Cancel booking error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to cancel booking",
      error: error.message,
    });
  }
};