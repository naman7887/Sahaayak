const Worker = require("../models/Worker");

const findMatchingWorkers = async (
  location,
  occupation = null,
  maxDistanceKm = 10
) => {
  if (
    !location ||
    !Array.isArray(location.coordinates) ||
    location.coordinates.length !== 2
  ) {
    throw new Error(
      "Valid location coordinates [longitude, latitude] are required"
    );
  }

  const query = {
    availability: true,
    verificationStatus: "verified",
  };

  if (occupation) {
    query.occupation = {
      $regex: new RegExp(occupation, "i"),
    };
  }

  const workers = await Worker.find({
    ...query,
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: location.coordinates,
        },
        $maxDistance: maxDistanceKm * 1000,
      },
    },
  })
    .populate("user", "name email phone")
    .sort({
      rating: -1,
      totalJobs: 1,
    });

  return workers;
};

module.exports = {
  findMatchingWorkers,
};