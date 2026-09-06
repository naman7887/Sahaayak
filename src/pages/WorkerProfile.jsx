import { useEffect, useState } from "react";
import "./WorkerProfile.css";

const SKILLS_BY_SERVICE = {
  Electrician: [
    "Fan Installation",
    "Switch & Socket Repair",
    "Wiring",
    "Electrical Maintenance",
  ],
  Plumber: [
    "Pipe Repair",
    "Tap Repair",
    "Leakage Repair",
    "Bathroom Plumbing",
  ],
  Carpenter: [
    "Furniture Repair",
    "Woodwork",
    "Door Repair",
    "Furniture Assembly",
  ],
  Painter: [
    "Wall Painting",
    "Interior Painting",
    "Exterior Painting",
    "Wall Finishing",
  ],
  Cleaner: [
    "Home Cleaning",
    "Deep Cleaning",
    "Kitchen Cleaning",
    "Bathroom Cleaning",
  ],
  "Appliance Repair": [
    "Appliance Repair",
    "Washing Machine Repair",
    "Refrigerator Repair",
    "General Maintenance",
  ],
  Mason: [
    "Masonry Work",
    "Brickwork",
    "Wall Repair",
    "Construction Work",
  ],
  Gardener: [
    "Gardening",
    "Lawn Maintenance",
    "Plant Care",
    "Garden Cleaning",
  ],
  "AC & Refrigeration": [
    "AC Repair",
    "AC Installation",
    "AC Maintenance",
    "Cooling System Repair",
  ],
};

function WorkerProfile() {
  const [user, setUser] = useState(null);
  const [worker, setWorker] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const [userResponse, workerResponse] = await Promise.all([
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
      ]);

      const userData = await userResponse.json();
      const workerData = await workerResponse.json();

      if (!userResponse.ok) {
        throw new Error(
          userData.message || "Unable to load user."
        );
      }

      if (!workerResponse.ok) {
        throw new Error(
          workerData.message ||
            "Unable to load worker profile."
        );
      }

      setUser(userData.user);
      setWorker(workerData.worker);
      setSelectedSkills(workerData.worker.skills || []);
    } catch (error) {
      console.error(error);
      setError(
        error.message || "Unable to load worker profile."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const availableSkills =
    SKILLS_BY_SERVICE[worker?.occupation] || [
      worker?.occupation || "General Service",
    ];

  const toggleSkill = (skill) => {
    setSelectedSkills((current) => {
      if (current.includes(skill)) {
        return current.filter((item) => item !== skill);
      }

      return [...current, skill];
    });
  };

  const changeOccupation = (occupation) => {
    setWorker({
      ...worker,
      occupation,
    });

    const defaultSkill = occupation
      ? [occupation]
      : [];

    setSelectedSkills(defaultSkill);
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    if (!worker.occupation) {
      alert("Please select your primary service.");
      return;
    }

    if (selectedSkills.length === 0) {
      alert("Please select at least one skill.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        "http://localhost:5000/api/workers/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            occupation: worker.occupation,
            skills: selectedSkills,
            experience: Number(worker.experience || 0),
            serviceRadius: Number(worker.serviceRadius || 10),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Unable to update worker profile."
        );
        return;
      }

      setWorker(data.worker);
      setSelectedSkills(data.worker.skills || []);

      alert("Profile updated successfully.");
    } catch (error) {
      console.error(error);
      alert("Cannot connect to backend.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="worker-profile-loading">
        Loading worker profile...
      </div>
    );
  }

  if (error || !worker) {
    return (
      <div className="worker-profile-loading worker-profile-error">
        {error || "Worker profile not found."}
      </div>
    );
  }

  return (
    <div className="worker-profile-page">

      {/* HEADER */}
      <div className="worker-profile-header">

        <div>
          <p>SAHAAYAK WORKER ACCOUNT</p>

          <h1>My Worker Profile</h1>

          <span>
            Keep your professional information updated
            for better job matching.
          </span>
        </div>

        <div
          className={`worker-verification ${
            worker.verificationStatus
          }`}
        >
          <span>●</span>

          {worker.verificationStatus === "verified"
            ? "Verified Worker"
            : worker.verificationStatus === "rejected"
            ? "Verification Rejected"
            : "Verification Pending"}
        </div>

      </div>

      <div className="worker-profile-layout">

        {/* PROFILE SUMMARY */}

        <div className="worker-profile-card">

          <div className="worker-profile-avatar">
            {(user?.name || "W")
              .charAt(0)
              .toUpperCase()}
          </div>

          <h2>
            {user?.name || "Service Provider"}
          </h2>

          <p className="worker-profile-role">
            {worker.occupation ||
              "Service Provider"}
          </p>

          <div className="worker-rating">
            ⭐{" "}
            {Number(worker.rating || 0).toFixed(1)}
          </div>

          <div className="worker-profile-stats">

            <div>
              <strong>
                {worker.totalJobs || 0}
              </strong>
              <span>Jobs</span>
            </div>

            <div>
              <strong>
                {worker.experience || 0}
              </strong>
              <span>Years</span>
            </div>

            <div>
              <strong>
                {worker.serviceRadius || 10}
              </strong>
              <span>KM Radius</span>
            </div>

          </div>

          <div className="profile-account-info">

            <div>
              <span>Email</span>
              <strong>
                {user?.email || "Not available"}
              </strong>
            </div>

            <div>
              <span>Phone</span>
              <strong>
                {user?.phone || "Not available"}
              </strong>
            </div>

            <div>
              <span>Availability</span>
              <strong
                className={
                  worker.availability
                    ? "profile-available"
                    : "profile-unavailable"
                }
              >
                {worker.availability
                  ? "● Available"
                  : "○ Unavailable"}
              </strong>
            </div>

          </div>

        </div>

        {/* EDIT FORM */}

        <form
          className="worker-edit-card"
          onSubmit={updateProfile}
        >

          <div className="profile-card-heading">

            <div>
              <h2>Professional Information</h2>

              <p>
                This information is used by Sahaayak's
                smart matching system.
              </p>
            </div>

          </div>

          <div className="worker-form-grid">

            {/* SERVICE */}

            <div className="worker-form-field">

              <label>
                Primary Service
              </label>

              <select
                value={worker.occupation || ""}
                onChange={(e) =>
                  changeOccupation(e.target.value)
                }
              >
                <option value="">
                  Select service
                </option>

                <option>Electrician</option>
                <option>Plumber</option>
                <option>Carpenter</option>
                <option>Painter</option>
                <option>Cleaner</option>
                <option>Appliance Repair</option>
                <option>Mason</option>
                <option>Gardener</option>
                <option>
                  AC & Refrigeration
                </option>
                <option>Other</option>
              </select>

            </div>

            {/* EXPERIENCE */}

            <div className="worker-form-field">

              <label>
                Experience
              </label>

              <input
                type="number"
                min="0"
                max="50"
                value={worker.experience ?? 0}
                onChange={(e) =>
                  setWorker({
                    ...worker,
                    experience: e.target.value,
                  })
                }
              />

              <small>
                Enter your total professional experience.
              </small>

            </div>

            {/* SERVICE RADIUS */}

            <div className="worker-form-field">

              <label>
                Service Radius
              </label>

              <div className="radius-input">

                <input
                  type="number"
                  min="1"
                  max="50"
                  value={
                    worker.serviceRadius ?? 10
                  }
                  onChange={(e) =>
                    setWorker({
                      ...worker,
                      serviceRadius: e.target.value,
                    })
                  }
                />

                <span>KM</span>

              </div>

              <small>
                Area where you are willing to accept jobs.
              </small>

            </div>

          </div>

          {/* SKILLS */}

          <div className="worker-skills-section">

            <label>
              Your Skills
            </label>

            <p className="skills-help">
              Select the services you are qualified to provide.
            </p>

            <div className="skills-selection">

              {availableSkills.map((skill) => {

                const selected =
                  selectedSkills.includes(skill);

                return (
                  <button
                    type="button"
                    key={skill}
                    className={`skill-option ${
                      selected ? "selected" : ""
                    }`}
                    onClick={() =>
                      toggleSkill(skill)
                    }
                  >
                    {selected ? "✓ " : "+ "}
                    {skill}
                  </button>
                );
              })}

            </div>

            <div className="selected-skills-count">
              {selectedSkills.length} skill
              {selectedSkills.length !== 1
                ? "s"
                : ""}{" "}
              selected
            </div>

          </div>

          {/* SAVE */}

          <button
            type="submit"
            className="save-profile-btn"
            disabled={saving}
          >
            {saving
              ? "Saving Changes..."
              : "Save Profile Changes"}
          </button>

        </form>

      </div>

      {/* MATCHING INFO */}

      <div className="profile-matching-banner">

        <div className="profile-matching-icon">
          🎯
        </div>

        <div>
          <strong>
            Better Profile = Better Matches
          </strong>

          <p>
            Sahaayak considers your service type,
            skills, location, availability, rating
            and service radius when finding suitable jobs.
          </p>
        </div>

      </div>

    </div>
  );
}

export default WorkerProfile;