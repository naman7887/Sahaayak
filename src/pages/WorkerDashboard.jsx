import { useEffect, useState } from "react";

function WorkerDashboard() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const loadWorkerDashboard = async () => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Get worker/user information
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

      // Get worker bookings
      const bookingResponse = await fetch(
        "http://localhost:5000/api/bookings/worker",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const bookingData = await bookingResponse.json();

      if (!bookingResponse.ok) {
        throw new Error(
          bookingData.message ||
            "Unable to load worker bookings."
        );
      }

      setBookings(bookingData.bookings || []);
    } catch (error) {
      console.error("Worker dashboard error:", error);

      setError(
        error.message ||
          "Cannot connect to the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkerDashboard();
  }, []);

  const updateBooking = async (bookingId, action) => {
    try {
      setActionLoading(bookingId);
      setError("");

      let url = "";
      let options = {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (action === "accept") {
        url = `http://localhost:5000/api/bookings/${bookingId}/accept`;
      }

      if (action === "reject") {
        url = `http://localhost:5000/api/bookings/${bookingId}/reject`;
      }

      if (action === "in-progress") {
        url = `http://localhost:5000/api/bookings/${bookingId}/status`;

        options.headers["Content-Type"] =
          "application/json";

        options.body = JSON.stringify({
          status: "in-progress",
        });
      }

      if (action === "completed") {
        url = `http://localhost:5000/api/bookings/${bookingId}/status`;

        options.headers["Content-Type"] =
          "application/json";

        options.body = JSON.stringify({
          status: "completed",
        });
      }

      const response = await fetch(url, options);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to update booking."
        );
      }

      // Reload bookings after every action
      await loadWorkerDashboard();
    } catch (error) {
      console.error("Booking update error:", error);

      setError(
        error.message ||
          "Unable to update booking."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString(
      "en-IN",
      {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }
    );
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

  const pendingBookings = bookings.filter(
    (booking) =>
      booking.status === "pending"
  );

  const activeBookings = bookings.filter(
    (booking) =>
      ["accepted", "in-progress"].includes(
        booking.status
      )
  );

  const completedBookings = bookings.filter(
    (booking) =>
      booking.status === "completed"
  );

  return (
    <main className="worker-dashboard-page">

      {/* HEADER */}

      <section className="worker-dashboard-header">

        <div>

          <p className="dashboard-label">
            PROVIDER DASHBOARD
          </p>

          <h1>
            Welcome back
            {user?.name
              ? `, ${user.name}`
              : ""}
          </h1>

          <p>
            Manage your service requests,
            bookings and earnings from one place.
          </p>

        </div>

        <div className="worker-status-pill">
          🟢 Available for work
        </div>

      </section>


      {/* ERROR */}

      {error && (
        <div className="booking-error">
          ⚠️ {error}
        </div>
      )}


      {/* SUMMARY */}

      <section className="worker-stats-grid">

        <div className="worker-stat-card">
          <span>Pending Requests</span>

          <strong>
            {pendingBookings.length}
          </strong>

          <p>
            New service requests
          </p>
        </div>

        <div className="worker-stat-card">
          <span>Active Jobs</span>

          <strong>
            {activeBookings.length}
          </strong>

          <p>
            Current assignments
          </p>
        </div>

        <div className="worker-stat-card">
          <span>Completed Jobs</span>

          <strong>
            {completedBookings.length}
          </strong>

          <p>
            Successfully completed
          </p>
        </div>

        <div className="worker-stat-card">
          <span>Rating</span>

          <strong>
            ⭐ 4.8
          </strong>

          <p>
            Customer rating
          </p>
        </div>

      </section>


      {/* BOOKING REQUESTS */}

      <section className="worker-dashboard-section">

        <div className="worker-section-header">

          <div>
            <p className="dashboard-label">
              SERVICE REQUESTS
            </p>

            <h2>
              Your bookings
            </h2>
          </div>

          <button
            className="worker-refresh-btn"
            onClick={loadWorkerDashboard}
          >
            ↻ Refresh
          </button>

        </div>


        {loading ? (

          <div className="worker-empty-state">
            <div>⏳</div>

            <h3>
              Loading your bookings...
            </h3>

            <p>
              Connecting to Sahaayak.
            </p>
          </div>

        ) : bookings.length === 0 ? (

          <div className="worker-empty-state">

            <div>📭</div>

            <h3>
              No bookings yet
            </h3>

            <p>
              New service requests assigned to
              you will appear here.
            </p>

          </div>

        ) : (

          <div className="worker-bookings-list">

            {bookings.map((booking) => (

              <div
                className="worker-booking-card"
                key={booking._id}
              >

                {/* TOP */}

                <div className="worker-booking-top">

                  <div className="worker-booking-icon">
                    🛠️
                  </div>

                  <div className="worker-booking-title">

                    <h3>
                      {booking.service?.name ||
                        "Service Booking"}
                    </h3>

                    <p>
                      {booking.service?.category ||
                        "Local Service"}
                    </p>

                  </div>

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


                {/* DETAILS */}

                <div className="worker-booking-details">

                  <div>
                    <span>Customer</span>

                    <strong>
                      {booking.customer?.name ||
                        "Customer"}
                    </strong>
                  </div>

                  <div>
                    <span>Date</span>

                    <strong>
                      {formatDate(
                        booking.scheduledDate
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>Time</span>

                    <strong>
                      {formatTime(
                        booking.scheduledDate
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>Price</span>

                    <strong>
                      ₹{booking.price}
                    </strong>
                  </div>

                </div>


                {/* ADDRESS */}

                <div className="worker-booking-address">

                  <span>
                    📍 Service Address
                  </span>

                  <strong>
                    {booking.address}
                  </strong>

                </div>


                {/* DESCRIPTION */}

                {booking.description && (

                  <p className="worker-booking-description">
                    <strong>
                      Request:
                    </strong>{" "}
                    {booking.description}
                  </p>

                )}


                {/* ACTIONS */}

                <div className="worker-booking-actions">

                  {booking.status ===
                    "pending" && (
                    <>
                      <button
                        className="worker-accept-btn"
                        disabled={
                          actionLoading ===
                          booking._id
                        }
                        onClick={() =>
                          updateBooking(
                            booking._id,
                            "accept"
                          )
                        }
                      >
                        {actionLoading ===
                        booking._id
                          ? "Processing..."
                          : "✓ Accept Request"}
                      </button>

                      <button
                        className="worker-reject-btn"
                        disabled={
                          actionLoading ===
                          booking._id
                        }
                        onClick={() =>
                          updateBooking(
                            booking._id,
                            "reject"
                          )
                        }
                      >
                        ✕ Reject
                      </button>
                    </>
                  )}

                  {booking.status ===
                    "accepted" && (
                    <button
                      className="worker-accept-btn"
                      disabled={
                        actionLoading ===
                        booking._id
                      }
                      onClick={() =>
                        updateBooking(
                          booking._id,
                          "in-progress"
                        )
                      }
                    >
                      {actionLoading ===
                      booking._id
                        ? "Updating..."
                        : "▶ Start Job"}
                    </button>
                  )}

                  {booking.status ===
                    "in-progress" && (
                    <button
                      className="worker-accept-btn"
                      disabled={
                        actionLoading ===
                        booking._id
                      }
                      onClick={() =>
                        updateBooking(
                          booking._id,
                          "completed"
                        )
                      }
                    >
                      {actionLoading ===
                      booking._id
                        ? "Updating..."
                        : "✓ Complete Job"}
                    </button>
                  )}

                  {booking.status ===
                    "completed" && (
                    <span className="job-completed-label">
                      ✓ Job completed successfully
                    </span>
                  )}

                  {booking.status ===
                    "rejected" && (
                    <span className="job-rejected-label">
                      Request rejected
                    </span>
                  )}

                </div>

              </div>

            ))}

          </div>

        )}

      </section>


      {/* EARNINGS */}

      <section className="worker-dashboard-section">

        <div className="worker-section-header">

          <div>
            <p className="dashboard-label">
              EARNINGS
            </p>

            <h2>
              Your earnings overview
            </h2>
          </div>

        </div>

        <div className="worker-earnings-card">

          <div>
            <span>
              Completed jobs this month
            </span>

            <strong>
              {completedBookings.length}
            </strong>
          </div>

          <div>
            <span>
              Service earnings
            </span>

            <strong>
              ₹
              {completedBookings.reduce(
                (total, booking) =>
                  total +
                  (booking.price || 0),
                0
              )}
            </strong>
          </div>

          <div>
            <span>
              Current rating
            </span>

            <strong>
              ⭐ 4.8
            </strong>
          </div>

        </div>

      </section>


      {/* WELFARE */}

      <section className="worker-dashboard-section">

        <div className="worker-section-header">

          <div>
            <p className="dashboard-label">
              WORKER WELFARE
            </p>

            <h2>
              Your benefits & support
            </h2>
          </div>

        </div>

        <div className="worker-welfare-grid">

          <div className="worker-welfare-card">

            <div>
              🎓
            </div>

            <h3>
              Training & Skills
            </h3>

            <p>
              Access skill development and
              service training programs.
            </p>

          </div>

          <div className="worker-welfare-card">

            <div>
              🛡️
            </div>

            <h3>
              Insurance & Protection
            </h3>

            <p>
              Explore available insurance and
              worker protection benefits.
            </p>

          </div>

          <div className="worker-welfare-card">

            <div>
              🏛️
            </div>

            <h3>
              Government Schemes
            </h3>

            <p>
              Discover government welfare
              schemes you may be eligible for.
            </p>

          </div>

        </div>

      </section>

    </main>
  );
}

export default WorkerDashboard;