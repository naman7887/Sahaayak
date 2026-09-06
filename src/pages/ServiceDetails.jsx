import { useEffect, useState } from "react";

function ServiceDetails() {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00 AM");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const serviceId = params.get("id");

    if (!serviceId) {
      setError("Service not found.");
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

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");

    setDate(`${yyyy}-${mm}-${dd}`);
  }, []);

  const handleFindProviders = () => {
    if (!date || !time || !service) {
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
      <div
        style={{
          minHeight: "calc(100vh - 72px)",
          background: "#f0fdfa",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "18px",
          color: "#64748b",
        }}
      >
        Loading service...
      </div>
    );
  }

  if (error || !service) {
    return (
      <div
        style={{
          minHeight: "calc(100vh - 72px)",
          background: "#f0fdfa",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#dc2626",
          fontSize: "18px",
        }}
      >
        {error || "Service not found."}
      </div>
    );
  }

  return (
    <div className="service-details-page">
      <div className="service-details-container">
        <div className="service-details-main">
          <div className="service-details-icon">
            🔧
          </div>

          <p className="service-details-category">
            {service.category}
          </p>

          <h1>{service.name}</h1>

          <p className="service-details-description">
            {service.description}
          </p>

          <div className="service-details-info-grid">
            <div className="service-info-box">
              <span>💰</span>
              <div>
                <small>Starting price</small>
                <strong>₹{service.basePrice}</strong>
              </div>
            </div>

            <div className="service-info-box">
              <span>⏱️</span>
              <div>
                <small>Estimated duration</small>
                <strong>
                  {service.estimatedDuration >= 60
                    ? `${Math.floor(service.estimatedDuration / 60)} hour${
                        service.estimatedDuration / 60 > 1 ? "s" : ""
                      }`
                    : `${service.estimatedDuration} minutes`}
                </strong>
              </div>
            </div>

            <div className="service-info-box">
              <span>📍</span>
              <div>
                <small>Service area</small>
                <strong>Your local community</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="service-details-booking">
          <h2>Book This Service</h2>

          <div className="booking-price">
            ₹{service.basePrice}
            <span>Starting price</span>
          </div>

          <div className="booking-detail-row">
            <span>⏱️</span>
            <div>
              <strong>Estimated duration</strong>
              <p>
                {service.estimatedDuration >= 60
                  ? `${Math.floor(service.estimatedDuration / 60)} hour${
                      service.estimatedDuration / 60 > 1 ? "s" : ""
                    }`
                  : `${service.estimatedDuration} minutes`}
              </p>
            </div>
          </div>

          <div className="booking-detail-row">
            <span>📍</span>
            <div>
              <strong>Service area</strong>
              <p>Your local community</p>
            </div>
          </div>

          <div className="booking-field">
            <label>Select date</label>

            <input
              type="date"
              value={date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="booking-field">
            <label>Select time</label>

            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
            >
              <option>08:00 AM</option>
              <option>09:00 AM</option>
              <option>10:00 AM</option>
              <option>11:00 AM</option>
              <option>12:00 PM</option>
              <option>01:00 PM</option>
              <option>02:00 PM</option>
              <option>03:00 PM</option>
              <option>04:00 PM</option>
              <option>05:00 PM</option>
              <option>06:00 PM</option>
              <option>07:00 PM</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleFindProviders}
            style={{
              width: "100%",
              marginTop: "20px",
              padding: "16px 20px",
              border: "none",
              borderRadius: "12px",
              background: "#0f766e",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 8px 18px rgba(15, 118, 110, 0.2)",
            }}
          >
            Find Available Providers →
          </button>

          <p
            style={{
              textAlign: "center",
              marginTop: "14px",
              color: "#64748b",
              fontSize: "13px",
            }}
          >
            Sahaayak will automatically find the best verified
            provider for your request.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ServiceDetails;