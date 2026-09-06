const axios = require("axios");

const ML_SERVICE_URL =
  process.env.ML_SERVICE_URL || "http://localhost:8000";

const checkMLService = async () => {
  const response = await axios.get(`${ML_SERVICE_URL}/health`);

  return response.data;
};

const forecastDemand = async (forecastData) => {
  const response = await axios.post(
    `${ML_SERVICE_URL}/forecast`,
    forecastData
  );

  return response.data;
};

const allocateWorkforce = async (allocationData) => {
  const response = await axios.post(
    `${ML_SERVICE_URL}/allocate`,
    allocationData
  );

  return response.data;
};

const planWorkforce = async (data) => {
  // Step 1: Forecast demand
  const forecast = await forecastDemand({
    city: data.city,
    state: data.state,
    service: data.service,
    date: data.date,
    workers_available: data.available_workers || 0,
    workers_assigned: data.workers_assigned || 0,
    bookings: data.bookings || 0,
    completed_jobs: data.completed_jobs || 0,
    cancelled_jobs: data.cancelled_jobs || 0,
    pending_jobs: data.pending_jobs || 0,
    avg_response_minutes: data.avg_response_minutes || 20
  });

  // Step 2: Allocate workers based on forecast
  const allocation = await allocateWorkforce({
    city: data.city,
    state: data.state,
    service: data.service,
    predicted_bookings: forecast.predicted_bookings,
    available_workers: data.available_workers || 0,
    workers_per_booking: data.workers_per_booking || 1
  });

  return {
    success: true,
    forecast,
    allocation
  };
};

module.exports = {
  checkMLService,
  forecastDemand,
  allocateWorkforce,
  planWorkforce
};