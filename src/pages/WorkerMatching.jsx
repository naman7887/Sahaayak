import { useEffect, useState } from "react";

function WorkerMatching() {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [booking, setBooking] = useState(null);

  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");

  const params = new URLSearchParams(window.location.search);

  const serviceId = params.get("service");
  const selectedDate = params.get("date");
  const selectedTime = params.get("time");

  useEffect(() => {
    if (!serviceId) {
      setError("Service information is missing.");
      setLoading(false);
      return;
    }

    const fetchService = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/services/${serviceId}`
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Unable to load service.");
          return;
        }

        setService(data.service);
      } catch (error) {
        console.error(error);
        setError("Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId]);

  const handleBooking = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login before booking a service.");
      window.location.href = "/login";
      return;
    }

    if (!address.trim()) {
      alert("Please enter your service address.");
      return;
    }

    if (!service) {
      return;
    }

    try {
      setBookingLoading(true);
      setError("");

      /*
        Demo location for now.
        This can later be replaced with the user's
        actual GPS/location from the frontend.
      */
      const location = {
        type: "Point",
        coordinates: [77.1025, 28.7041],
      };

      const scheduledDate = new Date(
        `${selectedDate} ${selectedTime}`
      );

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
            location,
            description:
              description.trim() ||
              `Request for ${service.name}`,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Unable to create booking."
        );
        return;
      }

      setBooking(data.booking);
      setSuccess(true);
    } catch (error) {
      console.error(error);
      setError("Unable to connect to the server.");
    } finally {
      setBookingLoading(false);
    }
  };

  const formatDate = (value) => {
    if (!value) return "Not selected";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="worker-matching-page">
        <div className="dashboard-loading">
          Finding service information...
        </div>
      </div>
    );
  }

  if (error && !service) {
    return (
      <div className="worker-matching-page">
        <div className="booking-success-card">
          <div className="success-icon">!</div>

          <h2>Something went wrong</h2>

          <p>{error}</p>

          <button
            className="secondary-action-btn"
            onClick={() => {
              window.location.href = "/find-services";
            }}
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  if (success && booking) {
    const workerName =
      booking.worker?.name ||
      booking.worker?.user?.name ||
      null;

    return (
      <div className="worker-matching-page">
        <div className="matching-header">
          <p className="matching-eyebrow">
            Booking Confirmed
          </p>

          <h1>Your service request is on its way!</h1>

          <p>
            Sahaayak has received your request and our
            smart matching system has processed it.
          </p>
        </div>

        <div className="booking-success-card">
          <div className="success-icon">✓</div>

          <h2>Booking Created Successfully</h2>

          <p>
            Your request for{" "}
            <strong>{service.name}</strong> has been
            submitted.
          </p>

          <div className="smart-match-result">
            <div className="smart-match-icon">
              🤖
            </div>

            <div>
              <strong>
                {workerName
                  ? `Provider matched: ${workerName}`
                  : "Finding the best provider"}
              </strong>

              <p>
                {workerName
                  ? "A verified provider has been automatically assigned to your request."
                  : "We are looking for an available verified provider in your area."}
              </p>
            </div>
          </div>

          <div className="booking-confirmation-details">
            <div>
              <span>Service</span>
              <strong>{service.name}</strong>
            </div>

            <div>
              <span>Date</span>
              <strong>
                {formatDate(booking.scheduledDate)}
              </strong>
            </div>

            <div>
              <span>Address</span>
              <strong>{booking.address}</strong>
            </div>

            <div>
              <span>Price</span>
              <strong>
                ₹{booking.price || service.basePrice}
              </strong>
            </div>

            <div>
              <span>Status</span>
              <strong>
                {booking.status === "pending"
                  ? "Waiting for Provider"
                  : booking.status}
              </strong>
            </div>

            <div>
              <span>Booking ID</span>
              <strong>
                {booking._id?.slice(-8).toUpperCase()}
              </strong>
            </div>
          </div>

          <div className="booking-success-actions">
            <button
              className="confirm-booking-btn"
              onClick={() => {
                window.location.href = "/dashboard";
              }}
            >
              View My Bookings
            </button>

            <button
              className="secondary-action-btn"
              onClick={() => {
                window.location.href = "/find-services";
              }}
            >
              Book Another Service
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="worker-matching-page">
      <div className="matching-header">
        <p className="matching-eyebrow">
          Smart Provider Matching
        </p>

        <h1>Complete Your Service Request</h1>

        <p>
          Tell us where you need the service and
          Sahaayak will automatically find the best
          available provider.
        </p>
      </div>

      <div className="booking-layout">
        <div className="booking-service-card">
          <div className="booking-service-icon">
            🔧
          </div>

          <p className="service-category">
            {service.category}
          </p>

          <h2>{service.name}</h2>

          <p>
            {service.description}
          </p>

          <div className="booking-price-large">
            ₹{service.basePrice}
            <span>Starting price</span>
          </div>

          <div className="booking-summary-item">
            <span>📅</span>
            <div>
              <small>Date</small>
              <strong>
                {formatDate(selectedDate)}
              </strong>
            </div>
          </div>

          <div className="booking-summary-item">
            <span>⏰</span>
            <div>
              <small>Time</small>
              <strong>
                {selectedTime || "Not selected"}
              </strong>
            </div>
          </div>

          <div className="booking-summary-item">
            <span>⏱️</span>
            <div>
              <small>Estimated duration</small>
              <strong>
                {service.estimatedDuration >= 60
                  ? `${Math.floor(
                      service.estimatedDuration / 60
                    )} hour${
                      service.estimatedDuration / 60 > 1
                        ? "s"
                        : ""
                    }`
                  : `${service.estimatedDuration} minutes`}
              </strong>
            </div>
          </div>
        </div>

        <div className="booking-form-card">
          <h2>Where do you need the service?</h2>

          <p className="booking-form-subtitle">
            Enter your address so we can match you
            with a nearby provider.
          </p>

          {error && (
            <div className="admin-error">
              {error}
            </div>
          )}

          <form onSubmit={handleBooking}>
            <div className="booking-field">
              <label>
                Service Address
                <span className="required">*</span>
              </label>

              <textarea
                value={address}
                onChange={(e) =>
                  setAddress(e.target.value)
                }
                placeholder="Enter your complete address..."
                rows="4"
                required
              />
            </div>

            <div className="booking-field">
              <label>
                Additional Details{" "}
                <span className="optional-label">
                  Optional
                </span>
              </label>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="Describe the problem or any special requirements..."
                rows="4"
              />
            </div>

            <div className="smart-match-info">
              <div className="smart-match-icon">
                🤖
              </div>

              <div>
                <strong>
                  Smart Matching Enabled
                </strong>

                <p>
                  Sahaayak automatically considers
                  provider availability, verification,
                  service category and location to find
                  the right provider.
                </p>
              </div>
            </div>

            <button
              type="submit"
              className="confirm-booking-btn"
              disabled={bookingLoading}
            >
              {bookingLoading
                ? "Finding Best Provider..."
                : "Confirm & Find Provider →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default WorkerMatching;