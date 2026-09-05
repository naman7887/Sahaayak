const Worker = require("../models/Worker");

// Get workers by verification status
const getWorkersByStatus = async (verificationStatus = "pending") => {
  const allowedStatuses = ["pending", "verified", "rejected"];

  if (!allowedStatuses.includes(verificationStatus)) {
    throw new Error("Invalid worker verification status");
  }

  return await Worker.find({
    verificationStatus,
  })
    .populate("user", "name email phone language isVerified")
    .sort({ createdAt: -1 });
};

// Update worker verification status
const updateWorkerVerificationStatus = async (
  workerId,
  verificationStatus
) => {
  const allowedStatuses = ["pending", "verified", "rejected"];

  if (!allowedStatuses.includes(verificationStatus)) {
    throw new Error("Invalid worker verification status");
  }

  const worker = await Worker.findById(workerId);

  if (!worker) {
    return null;
  }

  worker.verificationStatus = verificationStatus;

  // Rejected or pending workers should not be available for matching
  if (verificationStatus !== "verified") {
    worker.availability = false;
  }

  await worker.save();

  return await Worker.findById(worker._id).populate(
    "user",
    "name email phone language isVerified"
  );
};

module.exports = {
  getWorkersByStatus,
  updateWorkerVerificationStatus,
};