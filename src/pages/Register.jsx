import { useState } from "react";

function Register() {
  const [role, setRole] = useState("customer");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    language: "en",
    occupation: "Electrician",
  });

  const services = [
    "Electrician",
    "Plumber",
    "Carpenter",
    "Painter",
    "Cleaner",
    "Appliance Repair",
    "Mason",
    "Gardener",
    "AC & Refrigeration",
    "Other",
  ];

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);

    // Reset occupation when switching to worker
    if (selectedRole === "worker") {
      setFormData((prev) => ({
        ...prev,
        occupation: "Electrician",
      }));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const body = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: role,
        language: formData.language,
      };

      // Send occupation only for service providers
      if (role === "worker") {
        body.occupation = formData.occupation;
      }

      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      alert("Registration successful! Please login.");

      window.location.href = "/login";
    } catch (error) {
      console.error("Registration error:", error);
      alert("Cannot connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card register-card">
        <h1>Create Account</h1>

        <p className="auth-subtitle">
          Join Sahaayak today
        </p>

        <form onSubmit={handleRegister}>

          {/* Name */}
          <div className="form-group">
            <label>Full Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Phone */}
          <div className="form-group">
            <label>Phone Number</label>

            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Role */}
          <div className="form-group">
            <label>Account Type</label>

            <div className="role-selection">

              <button
                type="button"
                className={`role-option ${
                  role === "customer" ? "selected" : ""
                }`}
                onClick={() => handleRoleChange("customer")}
              >
                <span className="role-icon">👤</span>

                <span>
                  <strong>Customer</strong>
                  <small>Find and book services</small>
                </span>
              </button>

              <button
                type="button"
                className={`role-option ${
                  role === "worker" ? "selected" : ""
                }`}
                onClick={() => handleRoleChange("worker")}
              >
                <span className="role-icon">🛠️</span>

                <span>
                  <strong>Service Provider</strong>
                  <small>Provide services and earn</small>
                </span>
              </button>

            </div>
          </div>

          {/* Worker occupation */}
          {role === "worker" && (
            <div className="form-group">
              <label>What service do you provide?</label>

              <select
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                required
              >
                {services.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>

              <small className="field-help">
                This helps Sahaayak match you with relevant customer requests.
              </small>
            </div>
          )}

          {/* Language */}
          <div className="form-group">
            <label>Preferred Language</label>

            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}

export default Register;