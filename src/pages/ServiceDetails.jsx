import { useEffect, useState } from "react";

function ServiceDetails() {
  const [service, setService] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchService = async () => {
      try {
        const params = new URLSearchParams(
          window.location.search
        );

        const serviceId = params.get("id");

        if (!serviceId) {
          setError("Service not found.");
          return;
        }

        const response = await fetch(
          `http://localhost:5000/api/services/${serviceId}`
        );

        const data = await response.json();

        if (!response.ok) {
          setError(
            data.message || "Unable to load service."
          );
          return;
        }

        setService(data.service || data);
      } catch (error) {
        console.error("Service details error:", error);
        setError("Cannot connect to the backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, []);

  const formatDuration = (minutes) => {
    if (!minutes) return "Not specified";

    if (minutes < 60) {
      return `${minutes} min`;
    }

    const hours = minutes / 60;

    return Number.isInteger(hours)
      ? `${hours} hour${hours > 1 ? "s" : ""}`
      : `${hours.toFixed(1)} hours`;
  };

  const handleBooking = () => {
    if (!date || !time) {
      alert("Please select a date and time.");
      return;
    }

    window.location.href =
      `/worker-matching?service=${service._id}` +
      `&date=${date}` +
      `&time=${encodeURIComponent(time)}`;
  };

  if (loading) {
    return (
      <main className="service-details-page">
        <div className="matching-header">
          <h1>Loading service...</h1>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="service-details-page">
        <div className="no-results">
          <div>⚠️</div>

          <h3>
            Unable to load service
          </h3>

          <p>
            {error}
          </p>

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

  return (
    <main className="service-details-page">

      {/* BACK */}

      <div className="service-back">

        <button
          onClick={() =>
            (window.location.href = "/find-services")
          }
        >
          ← Back to Services
        </button>

      </div>


      {/* MAIN SERVICE */}

      <section className="service-details-card">

        <div className="service-details-main">

          <div className="service-details-icon">
            🛠️
          </div>

          <p className="service-details-category">
            {service.category}
          </p>

          <h1>
            {service.name}
          </h1>

          <div className="service-rating">
            ⭐ 4.8
            <span>•</span>
            <span>
              Verified local service
            </span>
          </div>

          <p className="service-details-description">
            {service.description}
          </p>


          {/* FEATURES */}

          <div className="service-features">

            <div className="service-feature">

              <span>✓</span>

              <div>
                <strong>
                  Verified Providers
                </strong>

                <p>
                  Skilled and verified local workers
                </p>
              </div>

            </div>


            <div className="service-feature">

              <span>✓</span>

              <div>
                <strong>
                  Transparent Pricing
                </strong>

                <p>
                  Know the starting price before booking
                </p>
              </div>

            </div>


            <div className="service-feature">

              <span>✓</span>

              <div>
                <strong>
                  Local Service
                </strong>

                <p>
                  Find providers from your community
                </p>
              </div>

            </div>


            <div className="service-feature">

              <span>✓</span>

              <div>
                <strong>
                  Secure Booking
                </strong>

                <p>
                  Safe and convenient service booking
                </p>
              </div>

            </div>

          </div>

        </div>


        {/* BOOKING CARD */}

        <aside className="booking-card">

          <p className="booking-label">
            BOOK THIS SERVICE
          </p>

          <h2>
            ₹{service.basePrice}
          </h2>

          <span className="booking-starting">
            Starting price
          </span>


          <div className="booking-info">

            <div>

              <span>⏱</span>

              <div>
                <strong>
                  Estimated duration
                </strong>

                <p>
                  {formatDuration(
                    service.estimatedDuration
                  )}
                </p>
              </div>

            </div>


            <div>

              <span>📍</span>

              <div>
                <strong>
                  Service area
                </strong>

                <p>
                  Your local community
                </p>
              </div>

            </div>

          </div>


          {/* DATE */}

          <label>
            Select date
          </label>

          <input
            type="date"
            value={date}
            min={
              new Date()
                .toISOString()
                .split("T")[0]
            }
            onChange={(e) =>
              setDate(e.target.value)
            }
          />


          {/* TIME */}

          <label>
            Select time
          </label>

          <select
            value={time}
            onChange={(e) =>
              setTime(e.target.value)
            }
          >

            <option value="">
              Choose a time
            </option>

            <option value="09:00 AM">
              09:00 AM
            </option>

            <option value="10:00 AM">
              10:00 AM
            </option>

            <option value="12:00 PM">
              12:00 PM
            </option>

            <option value="02:00 PM">
              02:00 PM
            </option>

            <option value="04:00 PM">
              04:00 PM
            </option>

            <option value="06:00 PM">
              06:00 PM
            </option>

          </select>


          {/* BOOK */}

          <button
            className="book-service-btn"
            onClick={handleBooking}
          >
            Find Available Providers
          </button>

          <p className="booking-note">
            Sahaayak will find suitable providers
            based on your request.
          </p>

        </aside>

      </section>

    </main>
  );
}

export default ServiceDetails;