const Cooperative = require("../models/Cooperative");
const User = require("../models/User");

// CREATE COOPERATIVE
// Admin only
const createCooperative = async (req, res) => {
  try {
    const {
      name,
      registrationNumber,
      type,
      parentFederation,
      description,
      state,
      city,
      address,
      contactEmail,
      contactPhone,
    } = req.body;

    if (!name || !registrationNumber || !state || !city) {
      return res.status(400).json({
        success: false,
        message:
          "Name, registration number, state and city are required",
      });
    }

    const cooperativeType = type || "society";

    if (!["federation", "society"].includes(cooperativeType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid cooperative type",
      });
    }

    // A federation cannot belong to another federation
    if (cooperativeType === "federation" && parentFederation) {
      return res.status(400).json({
        success: false,
        message: "A federation cannot belong to another federation",
      });
    }

    // A society can optionally belong to a federation
    if (cooperativeType === "society" && parentFederation) {
      const federation = await Cooperative.findOne({
        _id: parentFederation,
        type: "federation",
        isActive: true,
      });

      if (!federation) {
        return res.status(404).json({
          success: false,
          message: "Parent federation not found",
        });
      }
    }

    const existingCooperative = await Cooperative.findOne({
      registrationNumber,
    });

    if (existingCooperative) {
      return res.status(409).json({
        success: false,
        message: "Registration number already exists",
      });
    }

    const cooperative = await Cooperative.create({
      name,
      registrationNumber,
      type: cooperativeType,
      parentFederation:
        cooperativeType === "federation"
          ? null
          : parentFederation || null,
      description: description || "",
      state,
      city,
      address: address || "",
      contactEmail,
      contactPhone,
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: "Cooperative created successfully",
      data: cooperative,
    });
  } catch (error) {
    console.error("Create cooperative error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create cooperative",
      error: error.message,
    });
  }
};

// GET ALL COOPERATIVES
// Admin only
const getAllCooperatives = async (req, res) => {
  try {
    const { type, state, city, isActive } = req.query;

    const filter = {};

    if (type) {
      filter.type = type;
    }

    if (state) {
      filter.state = state;
    }

    if (city) {
      filter.city = city;
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    const cooperatives = await Cooperative.find(filter)
      .populate(
        "parentFederation",
        "name registrationNumber type state city"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: cooperatives.length,
      data: cooperatives,
    });
  } catch (error) {
    console.error("Get cooperatives error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch cooperatives",
      error: error.message,
    });
  }
};

// GET COOPERATIVE BY ID
const getCooperativeById = async (req, res) => {
  try {
    const cooperative = await Cooperative.findById(
      req.params.id
    ).populate(
      "parentFederation",
      "name registrationNumber type state city"
    );

    if (!cooperative) {
      return res.status(404).json({
        success: false,
        message: "Cooperative not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: cooperative,
    });
  } catch (error) {
    console.error("Get cooperative error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch cooperative",
      error: error.message,
    });
  }
};

// UPDATE COOPERATIVE
// Admin only
const updateCooperative = async (req, res) => {
  try {
    const {
      name,
      registrationNumber,
      description,
      state,
      city,
      address,
      contactEmail,
      contactPhone,
      isActive,
      parentFederation,
    } = req.body;

    const cooperative = await Cooperative.findById(req.params.id);

    if (!cooperative) {
      return res.status(404).json({
        success: false,
        message: "Cooperative not found",
      });
    }

    if (registrationNumber) {
      const duplicate = await Cooperative.findOne({
        registrationNumber,
        _id: { $ne: cooperative._id },
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: "Registration number already exists",
        });
      }

      cooperative.registrationNumber = registrationNumber;
    }

    if (parentFederation !== undefined) {
      if (cooperative.type === "federation" && parentFederation) {
        return res.status(400).json({
          success: false,
          message: "A federation cannot belong to another federation",
        });
      }

      if (cooperative.type === "society" && parentFederation) {
        if (
          parentFederation.toString() ===
          cooperative._id.toString()
        ) {
          return res.status(400).json({
            success: false,
            message: "A cooperative cannot be its own parent",
          });
        }

        const federation = await Cooperative.findOne({
          _id: parentFederation,
          type: "federation",
          isActive: true,
        });

        if (!federation) {
          return res.status(404).json({
            success: false,
            message: "Parent federation not found",
          });
        }

        cooperative.parentFederation = parentFederation;
      } else {
        cooperative.parentFederation = null;
      }
    }

    if (name !== undefined) cooperative.name = name;
    if (description !== undefined)
      cooperative.description = description;
    if (state !== undefined) cooperative.state = state;
    if (city !== undefined) cooperative.city = city;
    if (address !== undefined) cooperative.address = address;
    if (contactEmail !== undefined)
      cooperative.contactEmail = contactEmail;
    if (contactPhone !== undefined)
      cooperative.contactPhone = contactPhone;
    if (isActive !== undefined)
      cooperative.isActive = isActive;

    await cooperative.save();

    return res.status(200).json({
      success: true,
      message: "Cooperative updated successfully",
      data: cooperative,
    });
  } catch (error) {
    console.error("Update cooperative error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update cooperative",
      error: error.message,
    });
  }
};

// DEACTIVATE COOPERATIVE
// Admin only
const deleteCooperative = async (req, res) => {
  try {
    const cooperative = await Cooperative.findById(req.params.id);

    if (!cooperative) {
      return res.status(404).json({
        success: false,
        message: "Cooperative not found",
      });
    }

    cooperative.isActive = false;
    await cooperative.save();

    return res.status(200).json({
      success: true,
      message: "Cooperative deactivated successfully",
      data: cooperative,
    });
  } catch (error) {
    console.error("Delete cooperative error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to deactivate cooperative",
      error: error.message,
    });
  }
};

// GET SOCIETIES UNDER A FEDERATION
const getFederationSocieties = async (req, res) => {
  try {
    const federation = await Cooperative.findOne({
      _id: req.params.id,
      type: "federation",
    });

    if (!federation) {
      return res.status(404).json({
        success: false,
        message: "Federation not found",
      });
    }

    const societies = await Cooperative.find({
      parentFederation: federation._id,
      type: "society",
      isActive: true,
    }).sort({ name: 1 });

    return res.status(200).json({
      success: true,
      federation: {
        id: federation._id,
        name: federation.name,
        registrationNumber: federation.registrationNumber,
      },
      count: societies.length,
      data: societies,
    });
  } catch (error) {
    console.error("Get federation societies error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch federation societies",
      error: error.message,
    });
  }
};

// GET WORKERS BELONGING TO A COOPERATIVE
const getCooperativeWorkers = async (req, res) => {
  try {
    const cooperative = await Cooperative.findById(req.params.id);

    if (!cooperative) {
      return res.status(404).json({
        success: false,
        message: "Cooperative not found",
      });
    }

    const workers = await User.find({
      role: "worker",
      cooperative: cooperative._id,
    })
      .select(
        "_id name email phone role isActive occupation skills certifications cooperative"
      )
      .populate(
        "cooperative",
        "name registrationNumber type state city"
      );

    return res.status(200).json({
      success: true,
      cooperative: {
        id: cooperative._id,
        name: cooperative.name,
        type: cooperative.type,
      },
      count: workers.length,
      data: workers,
    });
  } catch (error) {
    console.error("Get cooperative workers error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch cooperative workers",
      error: error.message,
    });
  }
};

// ASSIGN WORKER TO COOPERATIVE
const assignWorkerToCooperative = async (req, res) => {
  try {
    const { workerId } = req.body;

    if (!workerId) {
      return res.status(400).json({
        success: false,
        message: "Worker ID is required",
      });
    }

    const cooperative = await Cooperative.findOne({
      _id: req.params.id,
      type: "society",
      isActive: true,
    });

    if (!cooperative) {
      return res.status(404).json({
        success: false,
        message: "Active cooperative society not found",
      });
    }

    const worker = await User.findOne({
      _id: workerId,
      role: "worker",
    });

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found",
      });
    }

    worker.cooperative = cooperative._id;
    await worker.save();

    const updatedWorker = await User.findById(worker._id)
      .select(
        "_id name email phone role occupation skills certifications cooperative"
      )
      .populate(
        "cooperative",
        "name registrationNumber type state city"
      );

    return res.status(200).json({
      success: true,
      message: "Worker assigned to cooperative successfully",
      data: updatedWorker,
    });
  } catch (error) {
    console.error("Assign worker error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to assign worker",
      error: error.message,
    });
  }
};

// REMOVE WORKER FROM COOPERATIVE
const removeWorkerFromCooperative = async (req, res) => {
  try {
    const worker = await User.findOne({
      _id: req.params.workerId,
      role: "worker",
    });

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found",
      });
    }

    if (
      !worker.cooperative ||
      worker.cooperative.toString() !== req.params.id.toString()
    ) {
      return res.status(400).json({
        success: false,
        message: "Worker does not belong to this cooperative",
      });
    }

    worker.cooperative = null;
    await worker.save();

    return res.status(200).json({
      success: true,
      message: "Worker removed from cooperative successfully",
    });
  } catch (error) {
    console.error("Remove worker error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove worker",
      error: error.message,
    });
  }
};

module.exports = {
  createCooperative,
  getAllCooperatives,
  getCooperativeById,
  updateCooperative,
  deleteCooperative,
  getFederationSocieties,
  getCooperativeWorkers,
  assignWorkerToCooperative,
  removeWorkerFromCooperative,
};