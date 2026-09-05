const User = require("../models/User");

// =====================================================
// GET WORKER PROFILE
// GET /api/workers/profile
// Protected - Worker
// =====================================================
const getWorkerProfile = async (req, res) => {
  try {
    const worker = await User.findById(req.user.id).select("-password");

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found",
      });
    }

    if (worker.role !== "worker") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Worker account required.",
      });
    }

    res.status(200).json({
      success: true,
      worker,
    });
  } catch (error) {
    console.error("Get worker profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch worker profile",
    });
  }
};

// =====================================================
// UPDATE WORKER PROFILE
// PUT /api/workers/profile
// Protected - Worker
// =====================================================
const updateWorkerProfile = async (req, res) => {
  try {
    const worker = await User.findById(req.user.id);

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found",
      });
    }

    if (worker.role !== "worker") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Worker account required.",
      });
    }

    const {
      name,
      phone,
      address,
      profileImage,
      skills,
      experience,
    } = req.body;

    if (name !== undefined) worker.name = name;
    if (phone !== undefined) worker.phone = phone;
    if (address !== undefined) worker.address = address;
    if (profileImage !== undefined) worker.profileImage = profileImage;
    if (skills !== undefined) worker.skills = skills;
    if (experience !== undefined) worker.experience = experience;

    const updatedWorker = await worker.save();

    const workerResponse = updatedWorker.toObject();
    delete workerResponse.password;

    res.status(200).json({
      success: true,
      message: "Worker profile updated successfully",
      worker: workerResponse,
    });
  } catch (error) {
    console.error("Update worker profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update worker profile",
    });
  }
};

// =====================================================
// UPDATE WORKER AVAILABILITY
// PATCH /api/workers/availability
// Protected - Worker
// =====================================================
const updateWorkerAvailability = async (req, res) => {
  try {
    const worker = await User.findById(req.user.id);

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found",
      });
    }

    if (worker.role !== "worker") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Worker account required.",
      });
    }

    const { availability } = req.body;

    if (availability === undefined) {
      return res.status(400).json({
        success: false,
        message: "Availability is required",
      });
    }

    worker.availability = availability;

    await worker.save();

    res.status(200).json({
      success: true,
      message: "Worker availability updated successfully",
      availability: worker.availability,
    });
  } catch (error) {
    console.error("Update worker availability error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update worker availability",
    });
  }
};

// =====================================================
// GET AVAILABLE WORKERS
// GET /api/workers/available
// Protected - Customer/User
// =====================================================
const getAvailableWorkers = async (req, res) => {
  try {
    const workers = await User.find({
      role: "worker",
      availability: true,
      isVerified: true,
    }).select("-password");

    res.status(200).json({
      success: true,
      count: workers.length,
      workers,
    });
  } catch (error) {
    console.error("Get available workers error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch available workers",
    });
  }
};

module.exports = {
  getWorkerProfile,
  updateWorkerProfile,
  updateWorkerAvailability,
  getAvailableWorkers,
};