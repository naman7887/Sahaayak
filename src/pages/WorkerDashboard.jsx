import { useEffect, useState } from "react";

function WorkerDashboard() {
  const [user, setUser] = useState(null);
  const [worker, setWorker] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchDashboard = async () => {
    try {
      setError("");

      const [userResponse, workerResponse, bookingResponse] =
        await Promise.all([
          fetch("http://localhost:5000/api/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),

          fetch("http://localhost:5000/api/workers/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),

          fetch("http://localhost:5000/api/bookings/worker", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

      const userData = await userResponse.json();
      const workerData = await workerResponse.json();
      const bookingData = await bookingResponse.json();

      if (!userResponse.ok) {
        throw new Error(userData.message || "Unable to load user.");
      }

      if (!workerResponse.ok) {
        throw new Error(
          workerData.message || "Unable to load worker profile."
        );
      }

      if (!bookingResponse.ok) {
        throw new Error(
          bookingData.message || "Unable to load bookings."
        );
      }

      setUser(userData.user);
      setWorker(workerData.worker);
      setBookings(bookingData.bookings || []);
    } catch (error) {
      console.error(error);
      setError(error.message || "Unable to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();

    const interval = setInterval(fetchDashboard, 15000);

    return () => clearInterval(interval);
  }, []);

  const toggleAvailability = async () => {
    if (!worker) return;

    try {
      setAvailabilityLoading(true);

      const newAvailability = !worker.availability;

      const response = await fetch(
        "http://localhost:5000/api/workers/availability",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            availability: newAvailability,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to update availability.");
        return;
      }

      setWorker({
        ...worker,
        availability: newAvailability,
      });
    } catch (error) {
      console.error(error);
      alert("Cannot connect to backend.");
    } finally {
      setAvailabilityLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, action) => {
    try {
      setActionLoading(true);

      let endpoint = "";
      let body = null;

      if (action === "accept") {
        endpoint = `/api/bookings/${bookingId}/accept`;
      }

      if (action === "reject") {
        endpoint = `/api/bookings/${bookingId}/reject`;
      }

      if (action === "in-progress") {
        endpoint = `/api/bookings/${bookingId}/status`;
        body = { status: "in-progress" };
      }

      if (action === "completed") {
        endpoint = `/api/bookings/${bookingId}/status`;
        body = { status: "completed" };
      }

      const response = await fetch(
        `http://localhost:5000${endpoint}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          ...(body && {
            body: JSON.stringify(body),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to update booking.");
        return;
      }

      await fetchDashboard();
    } catch (error) {
      console.error(error);
      alert("Cannot connect to backend.");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusClass = (status) => {
    if (status === "pending") return "booking-status-pending";
    if (status === "accepted") return "booking-status-accepted";
    if (status === "in-progress") return "booking-status-progress";
    if (status === "completed") return "booking-status-completed";
    if (status === "rejected") return "booking-status-rejected";
    if (status === "cancelled") return "booking-status-cancelled";

    return "";
  };

  const formatDate = (date) => {
    if (!date) return "Date not specified";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "pending"
  );

  const activeBookings = bookings.filter(
    (booking) =>
      booking.status === "accepted" ||
      booking.status === "in-progress"
  );

  const completedBookings = bookings.filter(
    (booking) => booking.status === "completed"
  );

  const earnings = completedBookings.reduce(
    (total, booking) => total + Number(booking.price || 0),
    0
  );

  const workerOccupation =
    worker?.occupation || "Service Provider";

  if (loading) {
    return (
      <div className="worker-profile-loading">
        Loading worker dashboard...
      </div>
    );
  }

  return (
    <div className="worker-dashboard-page">

      {/* HEADER */}
      <div className="worker-dashboard-header">

        <div>
          <p className="worker-dashboard-eyebrow">
            SAHAAYAK WORKER PANEL
          </p>

          <h1>
            Welcome, {user?.name || "Service Provider"} 👋
          </h1>

          <p>
            Manage your jobs, earnings and professional profile.
          </p>
        </div>

        <div className="worker-dashboard-header-actions">

          <div className="worker-profile-mini">
            <div className="worker-profile-mini-avatar">
              {(user?.name || "W").charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{user?.name || "Worker"}</strong>
              <span>{workerOccupation}</span>
            </div>
          </div>

          <a
            href="/worker-profile"
            className="worker-view-profile-btn"
          >
            View Profile →
          </a>

          <button
            className="worker-refresh-btn"
            onClick={fetchDashboard}
          >
            ↻
          </button>

        </div>

      </div>

      {/* AVAILABILITY */}
      <div className="worker-availability-card">

        <div className="availability-left">

          <div
            className={`availability-icon ${
              worker?.availability ? "online" : "offline"
            }`}
          >
            {worker?.availability ? "✓" : "○"}
          </div>

          <div>
            <strong>
              {worker?.availability
                ? "You are Available"
                : "You are Unavailable"}
            </strong>

            <p>
              {worker?.availability
                ? "Customers can be matched with you for suitable jobs."
                : "You won't receive new customer job matches."}
            </p>
          </div>

        </div>

        <button
          className={`availability-toggle ${
            worker?.availability ? "active" : ""
          }`}
          onClick={toggleAvailability}
          disabled={availabilityLoading}
        >
          <span className="toggle-circle"></span>

          {availabilityLoading
            ? "Updating..."
            : worker?.availability
            ? "Available"
            : "Unavailable"}
        </button>

      </div>

      {/* ERROR */}
      {error && (
        <div className="booking-error">
          ⚠️ {error}
        </div>
      )}

      {/* STATS */}
      <div className="worker-stats-grid">

        <div className="worker-stat-card">
          <div className="worker-stat-icon pending">
            📋
          </div>

          <div>
            <span>Pending Requests</span>
            <strong>{pendingBookings.length}</strong>
          </div>
        </div>

        <div className="worker-stat-card">
          <div className="worker-stat-icon active">
            🔧
          </div>

          <div>
            <span>Active Jobs</span>
            <strong>{activeBookings.length}</strong>
          </div>
        </div>

        <div className="worker-stat-card">
          <div className="worker-stat-icon completed">
            ✓
          </div>

          <div>
            <span>Completed Jobs</span>
            <strong>{completedBookings.length}</strong>
          </div>
        </div>

        <div className="worker-stat-card">
          <div className="worker-stat-icon earnings">
            ₹
          </div>

          <div>
            <span>Total Earnings</span>
            <strong>₹{earnings}</strong>
          </div>
        </div>

      </div>

      {/* BOOKINGS */}
      <section className="worker-dashboard-section">

        <div className="worker-section-header">
          <div>
            <h2>My Job Requests</h2>
            <p>
              Review and manage customer service requests.
            </p>
          </div>

          <span className="worker-booking-count">
            {bookings.length} Jobs
          </span>
        </div>

        {bookings.length === 0 ? (
          <div className="worker-empty-state">

            <div>📭</div>

            <h2>No Jobs Yet</h2>

            <p>
              New customer requests will automatically appear here
              when Sahaayak matches you with a suitable service.
            </p>

          </div>
        ) : (
          <div className="worker-bookings-list">

            {bookings.map((booking) => (

              <div
                className="worker-booking-card"
                key={booking._id}
              >

                <div className="worker-booking-top">

                  <div className="worker-booking-main-info">

                    <div className="worker-booking-icon">
                      🔧
                    </div>

                    <div>
                      <h3>
                        {booking.service?.name ||
                          booking.service?.category ||
                          "Service Request"}
                      </h3>

                      <p>
                        Customer:{" "}
                        {booking.customer?.name || "Customer"}
                      </p>
                    </div>

                  </div>

                  <span
                    className={`booking-status ${getStatusClass(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>

                </div>

                <div className="worker-booking-details">

                  <div>
                    <span>📅 Date</span>
                    <strong>
                      {formatDate(booking.scheduledDate)}
                    </strong>
                  </div>

                  <div>
                    <span>💰 Price</span>
                    <strong>
                      ₹{booking.price || 0}
                    </strong>
                  </div>

                  <div>
                    <span>📍 Address</span>
                    <strong>
                      {booking.address || "Address unavailable"}
                    </strong>
                  </div>

                </div>

                {booking.description && (
                  <div className="worker-booking-description">
                    <span>Customer Details</span>
                    <p>{booking.description}</p>
                  </div>
                )}

                {booking.status === "pending" && (
                  <div className="worker-booking-actions">

                    <button
                      className="worker-reject-btn"
                      disabled={actionLoading}
                      onClick={() =>
                        updateBookingStatus(
                          booking._id,
                          "reject"
                        )
                      }
                    >
                      Reject
                    </button>

                    <button
                      className="worker-accept-btn"
                      disabled={actionLoading}
                      onClick={() =>
                        updateBookingStatus(
                          booking._id,
                          "accept"
                        )
                      }
                    >
                      ✓ Accept Job
                    </button>

                  </div>
                )}

                {booking.status === "accepted" && (
                  <div className="worker-booking-actions">

                    <button
                      className="worker-accept-btn"
                      disabled={actionLoading}
                      onClick={() =>
                        updateBookingStatus(
                          booking._id,
                          "in-progress"
                        )
                      }
                    >
                      🔧 Start Job
                    </button>

                  </div>
                )}

                {booking.status === "in-progress" && (
                  <div className="worker-booking-actions">

                    <button
                      className="worker-accept-btn"
                      disabled={actionLoading}
                      onClick={() =>
                        updateBookingStatus(
                          booking._id,
                          "completed"
                        )
                      }
                    >
                      ✓ Mark Completed
                    </button>

                  </div>
                )}

                {booking.status === "completed" && (
                  <div className="job-completed-label">
                    ✓ Job Completed Successfully
                  </div>
                )}

                {booking.status === "rejected" && (
                  <div className="job-rejected-label">
                    Request rejected
                  </div>
                )}

                {booking.status === "cancelled" && (
                  <div className="job-rejected-label">
                    Booking cancelled
                  </div>
                )}

              </div>

            ))}

          </div>
        )}

      </section>

      {/* EARNINGS */}
      <section className="worker-earnings-card">

        <div>
          <p>YOUR EARNINGS</p>
          <h2>₹{earnings}</h2>
          <span>
            Based on completed Sahaayak jobs
          </span>
        </div>

        <div className="earnings-icon">
          💰
        </div>

      </section>

      {/* WELFARE */}
      <section className="worker-welfare-banner">

        <div className="worker-welfare-icon">
          🛡️
        </div>

        <div>
          <h2>Worker Welfare & Benefits</h2>

          <p>
            Explore government schemes, insurance,
            pension and skill-development resources.
          </p>
        </div>

        <a
          href="/worker-welfare"
          className="worker-welfare-btn"
        >
          Explore Benefits →
        </a>

      </section>

      {/* PROFILE */}
      <section className="worker-profile-action-card">

        <div>
          <h2>Keep Your Profile Updated</h2>

          <p>
            Accurate skills, experience and service radius
            help Sahaayak match you with better jobs.
          </p>
        </div>

        <a
          href="/worker-profile"
          className="worker-profile-action-btn"
        >
          View & Edit Profile →
        </a>

      </section>

      {/* TRUST */}
      <div className="worker-trust-strip">

        <span>🛡️</span>

        <div>
          <strong>Smart & Trusted Matching</strong>

          <p>
            Sahaayak matches customers with verified workers
            based on service type, availability, location and rating.
          </p>
        </div>

      </div>

    </div>
  );
}

export default WorkerDashboard;