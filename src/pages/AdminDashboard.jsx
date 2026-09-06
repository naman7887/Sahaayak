import { useEffect, useState } from "react";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/admin/workers?status=pending",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to load workers");
        return;
      }

      setWorkers(data.workers || []);
    } catch (error) {
      console.error(error);
      setError("Cannot connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const updateVerification = async (workerId, status) => {
    try {
      setActionLoading(true);

      const response = await fetch(
        `http://localhost:5000/api/admin/workers/${workerId}/verification`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            verificationStatus: status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Action failed");
        return;
      }

      fetchWorkers();
    } catch (error) {
      console.error(error);
      alert("Cannot connect to backend.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="admin-page">

      {/* HEADER */}
      <div className="admin-header">
        <div>
          <p className="admin-eyebrow">Sahaayak Administration</p>
          <h1>Admin Control Center</h1>
          <p>
            Manage worker verification and maintain a trusted
            service provider network.
          </p>
        </div>

        <button
          className="admin-refresh-btn"
          onClick={fetchWorkers}
          disabled={loading}
        >
          ↻ Refresh
        </button>
      </div>

      {/* STATS */}
      <div className="admin-stats-grid">

        <div className="admin-stat-card">
          <div className="admin-stat-icon">👷</div>
          <div>
            <span>Pending Workers</span>
            <strong>{workers.length}</strong>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon verified">✓</div>
          <div>
            <span>Verification System</span>
            <strong>Active</strong>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon protected">🛡️</div>
          <div>
            <span>Provider Safety</span>
            <strong>Protected</strong>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon network">🌐</div>
          <div>
            <span>Platform Status</span>
            <strong>Operational</strong>
          </div>
        </div>

      </div>

      {/* ERROR */}
      {error && (
        <div className="admin-error">
          ⚠️ {error}
        </div>
      )}

      {/* SECTION HEADER */}
      <div className="admin-section-header">
        <div>
          <h2>Worker Applications</h2>
          <p>
            Verify workers before they can receive customer bookings.
          </p>
        </div>

        <div className="admin-pending-count">
          {workers.length} Pending
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="admin-empty">
          <div className="admin-loading-icon">⟳</div>
          <h2>Loading Applications</h2>
          <p>Fetching pending worker applications...</p>
        </div>
      ) : workers.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-icon">✓</div>
          <h2>No Pending Workers</h2>
          <p>
            All worker applications have been reviewed.
          </p>
        </div>
      ) : (
        <div className="admin-workers-grid">

          {workers.map((worker) => (
            <div
              className="admin-worker-card"
              key={worker._id}
            >

              {/* WORKER HEADER */}
              <div className="admin-worker-top">

                <div className="admin-worker-avatar">
                  {(worker.user?.name || "S")
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className="admin-worker-title">
                  <h2>
                    {worker.user?.name || "Service Provider"}
                  </h2>

                  <span className="admin-pending-badge">
                    ● Pending Verification
                  </span>
                </div>

              </div>

              {/* WORKER INFO */}
              <div className="admin-worker-info">

                <div>
                  <span>🔧 Service</span>
                  <strong>
                    {worker.occupation || "Not specified"}
                  </strong>
                </div>

                <div>
                  <span>💼 Experience</span>
                  <strong>
                    {worker.experience || 0} years
                  </strong>
                </div>

                <div>
                  <span>📱 Phone</span>
                  <strong>
                    {worker.user?.phone || "Not available"}
                  </strong>
                </div>

                <div>
                  <span>✉️ Email</span>
                  <strong>
                    {worker.user?.email || "Not available"}
                  </strong>
                </div>

              </div>

              {/* SKILLS */}
              {worker.skills?.length > 0 && (
                <div className="admin-skills">
                  <span>Skills</span>

                  <div>
                    {worker.skills.map((skill, index) => (
                      <small key={index}>
                        {skill}
                      </small>
                    ))}
                  </div>
                </div>
              )}

              {/* ACTIONS */}
              <div className="admin-worker-actions">

                <button
                  className="admin-reject-btn"
                  disabled={actionLoading}
                  onClick={() =>
                    updateVerification(
                      worker._id,
                      "rejected"
                    )
                  }
                >
                  ✕ Reject
                </button>

                <button
                  className="admin-verify-btn"
                  disabled={actionLoading}
                  onClick={() =>
                    updateVerification(
                      worker._id,
                      "verified"
                    )
                  }
                >
                  ✓ Verify Worker
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

      {/* TRUST FOOTER */}
      <div className="admin-trust-strip">
        <div>🛡️</div>
        <div>
          <strong>Trusted Provider Network</strong>
          <p>
            Only verified service providers are eligible to
            receive customer bookings through Sahaayak.
          </p>
        </div>
      </div>

    </div>
  );
}

export default AdminDashboard;