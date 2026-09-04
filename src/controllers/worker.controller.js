const Worker = require("../models/Worker");
const User = require("../models/User");

// ======================================
// CREATE WORKER PROFILE
// ======================================

const createWorkerProfile = async (req, res) => {
  try {
    const {
      occupation,
      skills,
      experience,
      certifications,
      serviceRadius,
      location
    } = req.body;

    // Check if user is actually a worker
    if (req.user.role !== "worker") {
      return res.status(403).json({
        success: false,
        message: "Only workers can create a worker profile"
      });
    }

    // Check if profile already exists
    const existingWorker = await Worker.findOne({
      user: req.user._id
    });

    if (existingWorker) {
      return res.status(409).json({
        success: false,
        message: "Worker profile already exists"
      });
    }

    // Basic location validation
    if (
      !location ||
      !Array.isArray(location.coordinates) ||
      location.coordinates.length !== 2
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid location coordinates are required"
      });
    }

    const worker = await Worker.create({
      user: req.user._id,
      occupation,
      skills: skills || [],
      experience: experience || 0,
      certifications: certifications || [],
      serviceRadius: serviceRadius || 10,
      location: {
        type: "Point",
        coordinates: location.coordinates
      }
    });

    return res.status(201).json({
      success: true,
      message: "Worker profile created successfully",
      worker
    });

  } catch (error) {
    console.error("Create worker profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating worker profile"
    });
  }
};


// ======================================
// GET MY WORKER PROFILE
// ======================================

const getMyWorkerProfile = async (req, res) => {
  try {
    const worker = await Worker.findOne({
      user: req.user._id
    }).populate(
      "user",
      "name email phone language isVerified"
    );

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker profile not found"
      });
    }

    return res.status(200).json({
      success: true,
      worker
    });

  } catch (error) {
    console.error("Get worker profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


// ======================================
// UPDATE WORKER PROFILE
// ======================================

const updateWorkerProfile = async (req, res) => {
  try {
    const worker = await Worker.findOne({
      user: req.user._id
    });

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker profile not found"
      });
    }

    const {
      occupation,
      skills,
      experience,
      certifications,
      serviceRadius,
      location
    } = req.body;

    if (occupation !== undefined) {
      worker.occupation = occupation;
    }

    if (skills !== undefined) {
      worker.skills = skills;
    }

    if (experience !== undefined) {
      worker.experience = experience;
    }

    if (certifications !== undefined) {
      worker.certifications = certifications;
    }

    if (serviceRadius !== undefined) {
      worker.serviceRadius = serviceRadius;
    }

    if (location !== undefined) {
      if (
        !location.coordinates ||
        location.coordinates.length !== 2
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid location coordinates"
        });
      }

      worker.location = {
        type: "Point",
        coordinates: location.coordinates
      };
    }

    await worker.save();

    return res.status(200).json({
      success: true,
      message: "Worker profile updated successfully",
      worker
    });

  } catch (error) {
    console.error("Update worker profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating worker profile"
    });
  }
};


// ======================================
// UPDATE AVAILABILITY
// ======================================

const updateAvailability = async (req, res) => {
  try {
    const { availability } = req.body;

    if (typeof availability !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Availability must be true or false"
      });
    }

    const worker = await Worker.findOne({
      user: req.user._id
    });

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker profile not found"
      });
    }

    worker.availability = availability;

    await worker.save();

    return res.status(200).json({
      success: true,
      message: "Availability updated successfully",
      availability: worker.availability
    });

  } catch (error) {
    console.error("Availability update error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


module.exports = {
  createWorkerProfile,
  getMyWorkerProfile,
  updateWorkerProfile,
  updateAvailability
};