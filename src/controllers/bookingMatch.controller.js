const Service = require("../models/Service");
const Worker = require("../models/Worker");
const Booking = require("../models/Booking");
const Notification = require("../models/Notification");


// ==========================================
// FIND MATCHING WORKERS
// ==========================================

const findMatchingWorkers = async (
  location,
  category,
  radiusKm = 10
) => {
  if (
    !location ||
    !Array.isArray(location.coordinates) ||
    location.coordinates.length !== 2 ||
    !category
  ) {
    return [];
  }

  const workers = await Worker.find({
    occupation: {
      $regex: `^${category.trim()}$`,
      $options: "i",
    },

    availability: true,

    verificationStatus: "verified",

    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: location.coordinates,
        },
        $maxDistance: radiusKm * 1000,
      },
    },
  })
    .populate(
      "user",
      "name email phone role isVerified"
    )
    .limit(20);

  // Only return valid active worker accounts
  return workers.filter(
    (worker) =>
      worker.user &&
      worker.user.role === "worker"
  );
};


// ==========================================
// FORMAT WORKER FOR FRONTEND
// ==========================================

const formatWorker = (worker) => {
  return {
    _id: worker.user._id,

    name: worker.user.name,
    email: worker.user.email,
    phone: worker.user.phone,

    occupation: worker.occupation || "",

    skills: worker.skills || [],

    experience: worker.experience || 0,

    certifications:
      worker.certifications || [],

    serviceRadius:
      worker.serviceRadius || 10,

    location:
      worker.location || null,

    availability:
      worker.availability,

    rating:
      worker.rating || 0,

    totalJobs:
      worker.totalJobs || 0,

    verificationStatus:
      worker.verificationStatus,

    user: worker.user,
  };
};


// ==========================================
// PREVIEW WORKER MATCH
// ==========================================
//
// POST /api/bookings/preview-match
//
// Used by WorkerMatching.jsx before the
// customer confirms the booking.
// ==========================================

const previewMatch = async (req, res) => {
  try {
    const {
      service,
      location,
    } = req.body;

    // Validate request
    if (
      !service ||
      !location ||
      !Array.isArray(location.coordinates) ||
      location.coordinates.length !== 2
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Service and valid location coordinates are required",
      });
    }


    // Find service
    const serviceExists =
      await Service.findOne({
        _id: service,
        isActive: true,
      });

    if (!serviceExists) {
      return res.status(404).json({
        success: false,
        message:
          "Service not found or inactive",
      });
    }


    // Find nearby verified workers
    const workers =
      await findMatchingWorkers(
        location,
        serviceExists.category,
        10
      );


    // No worker available
    if (workers.length === 0) {
      return res.status(200).json({
        success: true,

        matchingWorkerFound: false,

        worker: null,

        message:
          "No verified and available worker found nearby",
      });
    }


    // Best match is the nearest worker
    const selectedWorker = workers[0];


    return res.status(200).json({
      success: true,

      matchingWorkerFound: true,

      worker:
        formatWorker(selectedWorker),
    });

  } catch (error) {
    console.error(
      "Preview worker matching error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to find a matching worker",

      error: error.message,
    });
  }
};


// ==========================================
// CREATE MATCHED BOOKING
// ==========================================
//
// POST /api/bookings/matched
//
// Creates the actual booking after the
// customer confirms the matched worker.
// ==========================================

const createMatchedBooking = async (
  req,
  res
) => {
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


    // Validate required fields
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


    // Verify service
    const serviceExists =
      await Service.findOne({
        _id: service,
        isActive: true,
      });

    if (!serviceExists) {
      return res.status(404).json({
        success: false,
        message:
          "Service not found or inactive",
      });
    }


    // Validate date
    const bookingDate =
      new Date(scheduledDate);

    if (
      Number.isNaN(
        bookingDate.getTime()
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid scheduled date",
      });
    }


    if (
      bookingDate <= new Date()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Scheduled date must be in the future",
      });
    }


    // Emergency booking
    const emergencyBooking =
      Boolean(isEmergency);


    // Determine priority
    const bookingPriority =
      emergencyBooking
        ? "urgent"
        : priority || "normal";


    if (
      ![
        "normal",
        "high",
        "urgent",
      ].includes(bookingPriority)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid priority",
      });
    }


    // Search radius
    const matchingRadius =
      emergencyBooking
        ? 25
        : 10;


    // Find workers again when booking
    // is actually confirmed.
    const workers =
      await findMatchingWorkers(
        location,
        serviceExists.category,
        matchingRadius
      );


    const selectedWorker =
      workers.length > 0
        ? workers[0]
        : null;


    // Create booking
    const booking =
      await Booking.create({
        customer: req.user._id,

        worker: selectedWorker
          ? selectedWorker.user._id
          : null,

        service,

        scheduledDate:
          bookingDate,

        address,

        location: {
          type: "Point",

          coordinates:
            location.coordinates,
        },

        description:
          description || "",

        price:
          price !== undefined &&
          price !== null
            ? Number(price)
            : serviceExists.basePrice || 0,

        isEmergency:
          emergencyBooking,

        priority:
          bookingPriority,

        status: "pending",
      });


    // ======================================
    // NOTIFY WORKER
    // ======================================

    if (selectedWorker) {
      await Notification.create({
        recipient:
          selectedWorker.user._id,

        title: emergencyBooking
          ? "Emergency Booking Request"
          : "New Booking Request",

        message: emergencyBooking
          ? `You have received an emergency ${serviceExists.name} booking request.`
          : `You have received a new ${serviceExists.name} booking request.`,

        booking:
          booking._id,

        type: "booking",
      });
    }


    // ======================================
    // NO WORKER FOUND
    // ======================================

    if (!selectedWorker) {
      await Notification.create({
        recipient:
          req.user._id,

        title: emergencyBooking
          ? "Emergency Request Received"
          : "Booking Received",

        message: emergencyBooking
          ? "Your emergency request has been received. We are looking for a nearby worker."
          : "Your booking has been received. We are looking for a suitable worker.",

        booking:
          booking._id,

        type: "booking",
      });
    }


    // Populate booking
    const populatedBooking =
      await Booking.findById(
        booking._id
      )
        .populate(
          "customer",
          "name email phone"
        )
        .populate(
          "worker",
          "name email phone"
        )
        .populate(
          "service",
          "name category basePrice"
        );


    return res.status(201).json({
      success: true,

      message: emergencyBooking
        ? "Emergency booking created successfully"
        : "Booking created successfully",

      data:
        populatedBooking,

      worker: selectedWorker
        ? formatWorker(
            selectedWorker
          )
        : null,

      matchingWorkers:
        workers.length,
    });

  } catch (error) {
    console.error(
      "Create matched booking error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to create booking",

      error: error.message,
    });
  }
};


// ==========================================
// EXPORT
// ==========================================

module.exports = {
  previewMatch,
  createMatchedBooking,
};