import { useEffect, useState } from "react";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [bookingError, setBookingError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    const loadDashboard = async () => {
      try {
        // Get logged-in user
        const userResponse = await fetch(
          "http://localhost:5000/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userData = await userResponse.json();

        if (!userResponse.ok) {
          localStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }

        setUser(userData.user);

        // Get customer's bookings
        const bookingResponse = await fetch(
          "http://localhost:5000/api/bookings/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const bookingData = await bookingResponse.json();

        if (!bookingResponse.ok) {
          setBookingError(
            bookingData.message || "Unable to load bookings."
          );
          return;
        }

        setBookings(bookingData.bookings || []);
      } catch (error) {
        console.error("Dashboard error:", error);
        setBookingError(
          "Cannot connect to the backend."
        );
      } finally {
        setLoadingBookings(false);
      }
    };

    loadDashboard();
  }, []);

  const formatDate = (date) => {
    if (!date) return "Date not available";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "accepted":
        return "status-accepted";

      case "in-progress":
        return "status-progress";

      case "completed":
        return "status-completed";

      case "cancelled":
        return "status-cancelled";

      case "rejected":
        return "status-rejected";

      default:
        return "status-pending";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "in-progress":
        return "In Progress";

      case "accepted":
        return "Accepted";

      case "completed":
        return "Completed";

      case "cancelled":
        return "Cancelled";

      case "rejected":
        return "Rejected";

      default:
        return "Pending";
    }
  };

  const upcomingBookings = bookings.filter(
    (booking) =>
      !["completed", "cancelled", "rejected"].includes(
        booking.status
      )
  );

  return (
    <main className="dashboard-page">

      {/* HEADER */}

      <section className="dashboard-header">

        <div>
          <p className="dashboard-label">
            CUSTOMER DASHBOARD
          </p>

          <h1>
            Welcome back{user?.name ? `, ${user.name}` : ""}
          </h1>

          <p>
            Find trusted local services and manage
            your bookings with Sahaayak.
          </p>
        </div>

        <button
          className="dashboard-primary-btn"
          onClick={() =>
            (window.location.href = "/find-services")
          }
        >
          Find a Service
        </button>

      </section>


      {/* LOCATION */}

      <section className="dashboard-location-card">

        <div className="location-icon">
          📍
        </div>

        <div>
          <span>YOUR SERVICE LOCATION</span>

          <strong>
            Local community
          </strong>
        </div>

      </section>


      {/* SEARCH */}

      <section className="dashboard-search">

        <span>🔍</span>

        <input
          type="text"
          placeholder="What service do you need?"
          onFocus={() =>
            (window.location.href = "/find-services")
          }
          readOnly
        />

      </section>


      {/* SERVICE CATEGORIES */}

      <section className="dashboard-section">

        <div className="dashboard-section-header">

          <div>
            <p className="dashboard-label">
              SERVICES
            </p>

            <h2>
              What do you need help with?
            </h2>
          </div>

          <button
            onClick={() =>
              (window.location.href = "/find-services")
            }
          >
            View all
          </button>

        </div>


        <div className="service-category-grid">

          <div
            className="service-category-card"
            onClick={() =>
              (window.location.href =
                "/find-services?category=Electrician")
            }
          >
            <div>⚡</div>
            <h3>Electrical</h3>
            <p>Repairs & installation</p>
          </div>

          <div
            className="service-category-card"
            onClick={() =>
              (window.location.href =
                "/find-services?category=Plumbing")
            }
          >
            <div>🔧</div>
            <h3>Plumbing</h3>
            <p>Repairs & maintenance</p>
          </div>

          <div
            className="service-category-card"
            onClick={() =>
              (window.location.href =
                "/find-services?category=Cleaning")
            }
          >
            <div>🧹</div>
            <h3>Cleaning</h3>
            <p>Home & community</p>
          </div>

          <div
            className="service-category-card"
            onClick={() =>
              (window.location.href =
                "/find-services")
            }
          >
            <div>🛠️</div>
            <h3>Home Services</h3>
            <p>Maintenance & repairs</p>
          </div>

        </div>

      </section>


      {/* EMERGENCY */}

      <section className="dashboard-emergency">

        <div>
          <span className="emergency-icon">
            🚨
          </span>

          <div>
            <h3>
              Need urgent help?
            </h3>

            <p>
              Find available providers for urgent
              household services.
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            (window.location.href =
              "/find-services")
          }
        >
          Find Help
        </button>

      </section>


      {/* BOOKINGS */}

      <section className="dashboard-section">

        <div className="dashboard-section-header">

          <div>
            <p className="dashboard-label">
              YOUR ACTIVITY
            </p>

            <h2>
              Upcoming bookings
            </h2>
          </div>

          <span className="booking-count">
            {bookings.length} total
          </span>

        </div>


        {loadingBookings ? (

          <div className="dashboard-empty-state">
            <div>⏳</div>

            <h3>
              Loading your bookings...
            </h3>
          </div>

        ) : bookingError ? (

          <div className="dashboard-empty-state">
            <div>⚠️</div>

            <h3>
              Unable to load bookings
            </h3>

            <p>
              {bookingError}
            </p>
          </div>

        ) : upcomingBookings.length === 0 ? (

          <div className="dashboard-empty-state">

            <div>📅</div>

            <h3>
              No upcoming bookings
            </h3>

            <p>
              Your upcoming service requests will
              appear here.
            </p>

            <button
              onClick={() =>
                (window.location.href =
                  "/find-services")
              }
            >
              Find a Service
            </button>

          </div>

        ) : (

          <div className="dashboard-bookings-list">

            {upcomingBookings
              .slice(0, 5)
              .map((booking) => (

                <div
                  className="dashboard-booking-card"
                  key={booking._id}
                >

                  <div className="booking-service-icon">
                    🛠️
                  </div>

                  <div className="booking-main">

                    <div className="booking-title-row">

                      <h3>
                        {booking.service?.name ||
                          "Service Booking"}
                      </h3>

                      <span
                        className={`booking-status ${getStatusClass(
                          booking.status
                        )}`}
                      >
                        {getStatusLabel(
                          booking.status
                        )}
                      </span>

                    </div>

                    <p>
                      {booking.service?.category ||
                        "Local Service"}
                    </p>

                    <div className="booking-meta">

                      <span>
                        📅{" "}
                        {formatDate(
                          booking.scheduledDate
                        )}
                      </span>

                      <span>
                        🕐{" "}
                        {formatTime(
                          booking.scheduledDate
                        )}
                      </span>

                    </div>

                    {booking.worker ? (
                      <div className="booking-worker">
                        <span>👷</span>

                        <span>
                          Provider:{" "}
                          <strong>
                            {booking.worker.name}
                          </strong>
                        </span>
                      </div>
                    ) : (
                      <div className="booking-worker">
                        <span>🔎</span>

                        <span>
                          Finding a suitable provider
                        </span>
                      </div>
                    )}

                  </div>

                  <div className="booking-price">

                    <span>
                      Total
                    </span>

                    <strong>
                      ₹{booking.price}
                    </strong>

                  </div>

                </div>

              ))}

          </div>

        )}

      </section>


      {/* QUICK FEATURES */}

      <section className="dashboard-feature-grid">

        <div className="dashboard-feature-card">
          <div>✓</div>

          <h3>
            Verified Providers
          </h3>

          <p>
            Connect with verified local service
            providers.
          </p>
        </div>

        <div className="dashboard-feature-card">
          <div>⭐</div>

          <h3>
            Smart Matching
          </h3>

          <p>
            Get matched with suitable providers
            based on your request.
          </p>
        </div>

        <div className="dashboard-feature-card">
          <div>🛡️</div>

          <h3>
            Safe & Reliable
          </h3>

          <p>
            Transparent bookings and secure
            service management.
          </p>
        </div>

      </section>

    </main>
  );
}

export default Dashboard;