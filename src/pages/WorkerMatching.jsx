import { useEffect, useState } from "react";

function WorkerMatching() {
  const [service, setService] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [address, setAddress] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [error, setError] = useState("");

  // Load the real service from MongoDB
  useEffect(() => {
    const fetchService = async () => {
      try {
        const params = new URLSearchParams(window.location.search);

        const serviceId = params.get("service");
        const date = params.get("date");
        const time = params.get("time");

        if (!serviceId) {
          setError("Service information is missing.");
          return;
        }

        const response = await fetch(
          `http://localhost:5000/api/services/${serviceId}`
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Unable to load service.");
          return;
        }

        setService({
          ...data.service,
          date,
          time,
        });
      } catch (error) {
        console.error("Service loading error:", error);
        setError("Cannot connect to the backend.");
      }
    };

    fetchService();
  }, []);

  // Demo providers for UI fallback
  const demoWorkers = [
    {
      id: 1,
      name: "Ramesh Kumar",
      skill: "Electrician",
      rating: "4.8",
      distance: "2.1 km",
      availability: "Available",
    },
    {
      id: 2,
      name: "Amit Sharma",
      skill: "Electrician",
      rating: "4.7",
      distance: "1.8 km",
      availability: "Available",
    },
    {
      id: 3,
      name: "Vikram Singh",
      skill: "Electrician",
      rating: "4.6",
      distance: "3.2 km",
      availability: "Available",
    },
  ];

  // Create real booking
  const handleConfirm = async () => {
    if (!selectedWorker) {
      alert("Please select a provider first.");
      return;
    }

    if (!address.trim()) {
      alert("Please enter your service address.");
      return;
    }

    if (!service?.date || !service?.time) {
      alert("Please select a date and time.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login before booking a service.");
      window.location.href = "/login";
      return;
    }

    setBookingLoading(true);
    setError("");

    try {
      const timeMap = {
        "09:00 AM": "09:00",
        "10:00 AM": "10:00",
        "12:00 PM": "12:00",
        "02:00 PM": "14:00",
        "04:00 PM": "16:00",
        "06:00 PM": "18:00",
      };

      const selectedTime = timeMap[service.time] || "10:00";

      const scheduledDate = new Date(
        `${service.date}T${selectedTime}:00`
      );

      // Temporary demo location for SIH prototype.
      // Format required by backend: [longitude, latitude]
      const demoLocation = {
        type: "Point",
        coordinates: [77.1025, 28.7041],
      };

      const response = await fetch(
        "http://localhost:5000/api/bookings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            service: service._id,
            scheduledDate: scheduledDate.toISOString(),
            address: address.trim(),
            location: demoLocation,
            description: `Request for ${service.name}`,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create booking."
        );
      }

      setBookingSuccess(data.booking);
    } catch (error) {
      console.error("Booking error:", error);
      setError(error.message || "Failed to create booking.");
    } finally {
      setBookingLoading(false);
    }
  };

  // Loading state
  if (!service && !error) {
    return (
      <main className="worker-matching-page">
        <div className="matching-header">
          <h1>Finding suitable providers...</h1>
          <p>Please wait while we prepare your service request.</p>
        </div>
      </main>
    );
  }

  // Service loading error
  if (!service && error) {
    return (
      <main className="worker-matching-page">
        <div className="matching-header">
          <h1>Unable to load service</h1>
          <p>{error}</p>

          <button
            onClick={() =>
              (window.location.href = "/find-services")
            }
          >
            Back to Services
          </button>
        </div>
      </main>
    );
  }

  // Successful booking
  if (bookingSuccess) {
    const matchedWorker = bookingSuccess.worker;

    return (
      <main className="worker-matching-page">
        {/* HEADER */}

        <section className="matching-header">
          <p className="dashboard-label">
            BOOKING CONFIRMED
          </p>

          <h1>
            Your service request has been created
          </h1>

          <p>
            Sahaayak has successfully processed your
            request and selected a suitable provider.
          </p>
        </section>

        {/* BOOKING SUMMARY */}

        <section className="request-summary">
          <div>
            <span>Service</span>

            <strong>
              {bookingSuccess.service?.name ||
                service.name}
            </strong>
          </div>

          <div>
            <span>Date</span>

            <strong>{service.date}</strong>
          </div>

          <div>
            <span>Time</span>

            <strong>{service.time}</strong>
          </div>
        </section>

        {/* SMART MATCH RESULT */}

        <section className="matching-section">
          <div className="matching-title">
            <div>
              <p>⭐ SMART MATCH</p>

              <h2>
                Your matched provider
              </h2>
            </div>

            <span>
              Selected by Sahaayak
            </span>
          </div>

          <div className="worker-matching-grid">
            <div className="matching-card recommended-card">
              <div className="recommended-badge">
                ⭐ Smart Match
              </div>

              <div className="matching-card-top">
                <div className="matching-avatar">
                  👷
                </div>

                <div>
                  <h3>
                    {matchedWorker?.name ||
                      "Provider assigned"}
                  </h3>

                  <p>
                    {bookingSuccess.service?.category ||
                      service.category}
                  </p>
                </div>
              </div>

              {matchedWorker ? (
                <div className="worker-rating">
                  <span>
                    ✓ Verified provider
                  </span>

                  <span>
                    • Booking assigned
                  </span>
                </div>
              ) : (
                <div className="worker-rating">
                  <span>
                    Provider matching is in progress
                  </span>
                </div>
              )}

              <div className="matching-reasons">
                <p>SMART MATCH RESULT</p>

                <div>
                  ✓ Provider selected by backend
                </div>

                <div>
                  ✓ Availability and service requirements checked
                </div>

                <div>
                  ✓ Local provider matching completed
                </div>
              </div>

              <div className="matching-bottom">
                <div>
                  <span>Booking status</span>

                  <strong>
                    {bookingSuccess.status}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONFIRMATION */}

        <div className="worker-confirmation">
          <div>
            <span>Booking ID</span>

            <strong>
              {bookingSuccess._id}
            </strong>

            <p>
              Your booking has been saved successfully.
            </p>
          </div>

          <button
            onClick={() =>
              (window.location.href = "/dashboard")
            }
          >
            Go to Dashboard
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="worker-matching-page">

      {/* HEADER */}

      <section className="matching-header">
        <p className="dashboard-label">
          SMART MATCHING
        </p>

        <h1>
          We've found suitable providers for you
        </h1>

        <p>
          Sahaayak helps you find suitable local
          providers based on availability, skills,
          distance and service requirements.
        </p>
      </section>

      {/* REQUEST SUMMARY */}

      <section className="request-summary">
        <div>
          <span>Service</span>

          <strong>
            {service.name}
          </strong>
        </div>

        <div>
          <span>Date</span>

          <strong>
            {service.date || "Not selected"}
          </strong>
        </div>

        <div>
          <span>Time</span>

          <strong>
            {service.time || "Not selected"}
          </strong>
        </div>
      </section>

      {/* AVAILABLE PROVIDERS */}

      <section className="matching-section">
        <div className="matching-title">
          <div>
            <p>AVAILABLE PROVIDERS</p>

            <h2>
              Choose a provider
            </h2>
          </div>

          <span>
            {demoWorkers.length} providers
          </span>
        </div>

        <div className="worker-matching-grid">

          {demoWorkers.map((worker) => (
            <div
              className={`matching-card ${
                selectedWorker?.id === worker.id
                  ? "recommended-card"
                  : ""
              }`}
              key={worker.id}
            >

              {selectedWorker?.id === worker.id && (
                <div className="recommended-badge">
                  ✓ Selected
                </div>
              )}

              <div className="matching-card-top">
                <div className="matching-avatar">
                  👷
                </div>

                <div>
                  <h3>
                    {worker.name}
                  </h3>

                  <p>
                    {worker.skill}
                  </p>
                </div>
              </div>

              <div className="worker-rating">
                <span>
                  ⭐ {worker.rating}
                </span>

                <span>
                  • {worker.distance}
                </span>

                <span className="available-text">
                  • {worker.availability}
                </span>
              </div>

              <div className="matching-reasons">
                <p>PROVIDER DETAILS</p>

                <div>
                  ✓ Available for your request
                </div>

                <div>
                  ✓ Local service provider
                </div>

                <div>
                  ✓ Verified {worker.skill}
                </div>
              </div>

              <div className="matching-bottom">
                <div>
                  <span>Service price</span>

                  <strong>
                    ₹{service.basePrice}
                  </strong>
                </div>

                <button
                  onClick={() =>
                    setSelectedWorker(worker)
                  }
                >
                  {selectedWorker?.id === worker.id
                    ? "Selected"
                    : "Select"}
                </button>
              </div>
            </div>
          ))}

        </div>
      </section>

      {/* ADDRESS */}

      {selectedWorker && (
        <section className="matching-section">

          <div className="matching-title">
            <div>
              <p>BOOKING DETAILS</p>

              <h2>
                Where should the service be provided?
              </h2>
            </div>
          </div>

          <div className="booking-address-box">
            <label>
              Service Address
            </label>

            <textarea
              value={address}
              onChange={(e) =>
                setAddress(e.target.value)
              }
              placeholder="Enter your complete service address"
              rows="3"
            />

            <small>
              Example: House No. 24, Main Road,
              New Delhi
            </small>
          </div>

        </section>
      )}

      {/* SELECTED PROVIDER */}

      {selectedWorker && (
        <div className="worker-confirmation">

          <div>
            <span>
              Selected provider
            </span>

            <strong>
              {selectedWorker.name}
            </strong>

            <p>
              ⭐ {selectedWorker.rating}
              {" • "}
              {selectedWorker.distance} away
            </p>
          </div>

          <button
            onClick={handleConfirm}
            disabled={bookingLoading}
          >
            {bookingLoading
              ? "Creating Booking..."
              : "Confirm Booking"}
          </button>

        </div>
      )}

      {/* ERROR */}

      {error && service && (
        <div className="booking-error">
          ⚠️ {error}
        </div>
      )}

    </main>
  );
}

export default WorkerMatching;