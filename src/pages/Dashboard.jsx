import { useEffect, useState } from "react";
import "./Dashboard.css";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [reviewBooking, setReviewBooking] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchDashboard = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const [userResponse, bookingsResponse] = await Promise.all([
        fetch("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),

        fetch("http://localhost:5000/api/bookings/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const userData = await userResponse.json();
      const bookingData = await bookingsResponse.json();

      if (!userResponse.ok) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }

      if (!bookingsResponse.ok) {
        setError(
          bookingData.message || "Unable to load bookings."
        );
      }

      setUser(userData.user);
      setBookings(bookingData.bookings || []);
    } catch (error) {
      console.error("Dashboard error:", error);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();

    const interval = setInterval(() => {
      fetchDashboard(true);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Waiting for Provider";
      case "accepted":
        return "Provider Accepted";
      case "in-progress":
        return "Service In Progress";
      case "completed":
        return "Completed";
      case "rejected":
        return "Request Rejected";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "status-pending";
      case "accepted":
        return "status-accepted";
      case "in-progress":
        return "status-in-progress";
      case "completed":
        return "status-completed";
      case "rejected":
        return "status-rejected";
      case "cancelled":
        return "status-cancelled";
      default:
        return "";
    }
  };

  const formatDate = (value) => {
    if (!value) return "Date not available";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Date not available";
    }

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (value) => {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const submitReview = async () => {
    if (!reviewBooking) return;

    if (!reviewBooking.worker) {
      alert("There is no assigned provider for this booking.");
      return;
    }

    if (rating === 0) {
      alert("Please select a rating.");
      return;
    }

    try {
      setReviewLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/reviews",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            worker: reviewBooking.worker._id,
            booking: reviewBooking._id,
            rating,
            comment: reviewText.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to submit review.");
        return;
      }

      alert("Thank you! Your review has been submitted.");

      setReviewBooking(null);
      setRating(0);
      setReviewText("");

      fetchDashboard(true);
    } catch (error) {
      console.error("Review error:", error);
      alert("Unable to connect to the server.");
    } finally {
      setReviewLoading(false);
    }
  };

  const activeBookings = bookings.filter(
    (booking) =>
      !["completed", "cancelled", "rejected"].includes(
        booking.status
      )
  );

  const completedBookings = bookings.filter(
    (booking) => booking.status === "completed"
  );

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">
          Loading your Sahaayak dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">

      {/* HEADER */}

      <div className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">
            Sahaayak Customer Dashboard
          </p>

          <h1>
            Welcome back,
            <br />
            <span>{user?.name || "Customer"}</span> 👋
          </h1>

          <p className="dashboard-location">
            📍 Serving your local community
          </p>
        </div>

        <button
          className="dashboard-refresh-btn"
          onClick={() => fetchDashboard(true)}
          disabled={refreshing}
        >
          {refreshing ? "Refreshing..." : "↻ Refresh"}
        </button>
      </div>

      {/* ERROR */}

      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}

      {/* SEARCH */}

      <div className="service-search-card">
        <div className="service-search-content">
          <div>
            <p className="dashboard-eyebrow">
              Need a service?
            </p>

            <h2>
              Find trusted local providers
            </h2>

            <p>
              Choose a service and let Sahaayak's smart
              matching system find the right provider for you.
            </p>
          </div>

          <button
            className="dashboard-search-btn"
            onClick={() => {
              window.location.href = "/find-services";
            }}
          >
            🔍 Search Services
          </button>
        </div>
      </div>

      {/* ACTIONS */}

      <div className="dashboard-action-buttons">
        <button
          className="dashboard-primary-action"
          onClick={() => {
            window.location.href = "/find-services";
          }}
        >
          + Book a Service
        </button>

        <button
          className="dashboard-bookings-btn"
          onClick={() => {
            document
              .getElementById("my-bookings")
              ?.scrollIntoView({
                behavior: "smooth",
              });
          }}
        >
          📋 My Bookings ({bookings.length})
        </button>
      </div>

      {/* POPULAR SERVICES */}

      <section className="dashboard-section">
        <div className="dashboard-section-header">
          <div>
            <p className="dashboard-eyebrow">
              Popular Categories
            </p>

            <h2>What do you need help with?</h2>
          </div>
        </div>

        <div className="popular-services-grid">

          {[
            ["⚡", "Electrician"],
            ["🔧", "Plumber"],
            ["🪚", "Carpenter"],
            ["🧹", "Cleaning"],
            ["🎨", "Painting"],
            ["🌱", "Gardening"],
          ].map(([icon, name]) => (
            <button
              key={name}
              onClick={() => {
                window.location.href =
                  `/find-services?category=${name}`;
              }}
            >
              <span>{icon}</span>
              <strong>{name}</strong>
              <small>Local services</small>
            </button>
          ))}

        </div>
      </section>

      {/* BOOKINGS */}

      <section
        className="dashboard-section"
        id="my-bookings"
      >
        <div className="dashboard-section-header">
          <div>
            <p className="dashboard-eyebrow">
              Your Activity
            </p>

            <h2>My Bookings</h2>

            <p>
              Track your service requests in real time.
            </p>
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="dashboard-empty">
            <div className="empty-icon">
              📋
            </div>

            <h3>No bookings yet</h3>

            <p>
              Book your first local service and we'll
              find a suitable provider for you.
            </p>

            <button
              className="dashboard-primary-action"
              onClick={() => {
                window.location.href =
                  "/find-services";
              }}
            >
              Find a Service
            </button>
          </div>
        ) : (
          <div className="customer-bookings-list">

            {bookings.map((booking) => {
              const serviceName =
                booking.service?.name ||
                "Service Request";

              const workerName =
                booking.worker?.name ||
                booking.worker?.user?.name ||
                null;

              return (
                <div
                  className="customer-booking-card"
                  key={booking._id}
                >
                  <div className="customer-booking-main">

                    <div className="customer-booking-icon">
                      🔧
                    </div>

                    <div>
                      <h3>{serviceName}</h3>

                      <p className="booking-address">
                        📍 {booking.address}
                      </p>

                      <p className="booking-date">
                        📅{" "}
                        {formatDate(
                          booking.scheduledDate
                        )}
                        {" • "}
                        ⏰{" "}
                        {formatTime(
                          booking.scheduledDate
                        )}
                      </p>

                      {booking.description && (
                        <p className="booking-description">
                          {booking.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="customer-booking-right">

                    <span
                      className={`booking-status ${getStatusClass(
                        booking.status
                      )}`}
                    >
                      {getStatusText(booking.status)}
                    </span>

                    {workerName ? (
                      <div className="assigned-worker">
                        <span>Provider</span>

                        <strong>
                          👤 {workerName}
                        </strong>
                      </div>
                    ) : (
                      booking.status === "pending" && (
                        <div className="matching-worker">
                          🤖 Finding the best provider...
                        </div>
                      )
                    )}

                    <div className="booking-price">
                      ₹{booking.price || 0}
                    </div>

                    {/* REVIEW BUTTON */}

                    {booking.status === "completed" &&
                      booking.worker && (
                        <button
                          className="review-provider-btn"
                          onClick={() => {
                            setReviewBooking(booking);
                            setRating(0);
                            setReviewText("");
                          }}
                        >
                          ⭐ Rate Provider
                        </button>
                      )}

                  </div>
                </div>
              );
            })}

          </div>
        )}
      </section>

      {/* SUMMARY */}

      <div className="dashboard-summary-grid">

        <div className="dashboard-summary-card">
          <span>📋</span>

          <div>
            <small>Total Bookings</small>
            <strong>{bookings.length}</strong>
          </div>
        </div>

        <div className="dashboard-summary-card">
          <span>🔄</span>

          <div>
            <small>Active Requests</small>
            <strong>{activeBookings.length}</strong>
          </div>
        </div>

        <div className="dashboard-summary-card">
          <span>✓</span>

          <div>
            <small>Completed Services</small>
            <strong>{completedBookings.length}</strong>
          </div>
        </div>

      </div>

      {/* SMART MATCHING */}

      <section className="smart-dashboard-card">

        <div className="smart-dashboard-icon">
          🤖
        </div>

        <div>
          <p className="dashboard-eyebrow">
            Powered by Smart Matching
          </p>

          <h2>
            We find the right provider for you
          </h2>

          <p>
            Sahaayak considers service type,
            provider availability, verification,
            location and other matching factors to
            connect you with a suitable local worker.
          </p>
        </div>

      </section>

      {/* FEATURES */}

      <section className="dashboard-section">

        <div className="dashboard-section-header">
          <div>
            <p className="dashboard-eyebrow">
              Why Sahaayak?
            </p>

            <h2>
              Simple, trusted and community focused
            </h2>
          </div>
        </div>

        <div className="dashboard-features-grid">

          <div className="dashboard-feature-card">
            <div>✓</div>

            <h3>
              Verified Providers
            </h3>

            <p>
              Providers are reviewed and verified
              before receiving service requests.
            </p>
          </div>

          <div className="dashboard-feature-card">
            <div>⚡</div>

            <h3>
              Smart Matching
            </h3>

            <p>
              Our system automatically finds suitable
              available providers near you.
            </p>
          </div>

          <div className="dashboard-feature-card">
            <div>🤝</div>

            <h3>
              Community First
            </h3>

            <p>
              Connect with local service professionals
              and support your community.
            </p>
          </div>

        </div>
      </section>

      {/* EMERGENCY */}

      <div className="dashboard-emergency-card">

        <div>
          <span>🚨</span>

          <div>
            <h3>
              Need urgent help?
            </h3>

            <p>
              Quickly find an available local provider
              for urgent household requirements.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            window.location.href =
              "/find-services";
          }}
        >
          Find Help
        </button>

      </div>

      {/* REVIEW MODAL */}

      {reviewBooking && (
        <div className="review-modal-overlay">

          <div className="review-modal">

            <button
              className="review-close-btn"
              onClick={() => {
                setReviewBooking(null);
              }}
            >
              ×
            </button>

            <div className="review-icon">
              ⭐
            </div>

            <h2>
              Rate Your Provider
            </h2>

            <p>
              How was your experience with{" "}
              <strong>
                {reviewBooking.worker?.name ||
                  reviewBooking.worker?.user?.name ||
                  "your provider"}
              </strong>
              ?
            </p>

            <div className="rating-stars">

              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className={
                    star <= rating
                      ? "star active"
                      : "star"
                  }
                  onClick={() => {
                    setRating(star);
                  }}
                >
                  ★
                </button>
              ))}

            </div>

            <p className="rating-label">
              {rating === 0
                ? "Select a rating"
                : `${rating} out of 5`}
            </p>

            <textarea
              value={reviewText}
              onChange={(e) =>
                setReviewText(e.target.value)
              }
              placeholder="Tell us about your experience..."
              rows="4"
            />

            <button
              className="submit-review-btn"
              onClick={submitReview}
              disabled={reviewLoading}
            >
              {reviewLoading
                ? "Submitting..."
                : "Submit Review"}
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

export default Dashboard;