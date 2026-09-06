import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const setupWorkerProfile = async (token, occupation) => {
    try {
      // Create worker profile
      const profileResponse = await fetch(
        "http://localhost:5000/api/workers/profile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            occupation: occupation || "Electrician",

            skills: [occupation || "Electrician"],

            experience: 1,

            certifications: [],

            serviceRadius: 10,

            // Temporary demo location
            // [longitude, latitude]
            location: {
              type: "Point",
              coordinates: [77.1025, 28.7041],
            },
          }),
        }
      );

      const profileData = await profileResponse.json();

      if (!profileResponse.ok) {
        // Profile may already exist
        if (
          profileResponse.status !== 409 &&
          profileData.message !== "Worker profile already exists"
        ) {
          console.error(
            "Worker profile creation failed:",
            profileData
          );
        }
      }

      // Enable worker availability
      const availabilityResponse = await fetch(
        "http://localhost:5000/api/workers/availability",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            availability: true,
          }),
        }
      );

      const availabilityData =
        await availabilityResponse.json();

      if (!availabilityResponse.ok) {
        console.error(
          "Availability update failed:",
          availabilityData
        );
      }

      return true;
    } catch (error) {
      console.error(
        "Worker profile setup error:",
        error
      );

      return false;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      // LOGIN
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Login failed");
        return;
      }

      // Save token
      localStorage.setItem("token", data.token);

      // Get current user
      const meResponse = await fetch(
        "http://localhost:5000/api/auth/me",
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        }
      );

      const meData = await meResponse.json();

      if (!meResponse.ok) {
        alert("Unable to load user information.");
        return;
      }

      const user = meData.user;

      console.log("Logged in user:", user);

      if (user.role === "admin") {
  alert("Admin login successful!");
  window.location.href = "/admin-dashboard";
  return;
}
      // WORKER
      if (user.role === "worker") {
        const savedProfile =
          localStorage.getItem("pendingWorkerProfile");

        let occupation = "Electrician";

        if (savedProfile) {
          try {
            const profile = JSON.parse(savedProfile);

            if (profile.occupation) {
              occupation = profile.occupation;
            }
          } catch (error) {
            console.error(
              "Profile data error:",
              error
            );
          }
        }

        // Create profile + enable availability
        await setupWorkerProfile(
          data.token,
          occupation
        );

        // Remove temporary registration data
        localStorage.removeItem(
          "pendingWorkerProfile"
        );

        alert(
          "Welcome to Sahaayak! Your service provider profile is ready."
        );

        window.location.href =
          "/worker-dashboard";

        return;
      }

      // CUSTOMER
      alert("Login successful!");

      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Login error:", error);

      alert(
        "Cannot connect to the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Welcome Back</h1>

        <p className="auth-subtitle">
          Login to your Sahaayak account
        </p>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />
          </div>

          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading
              ? "Setting up..."
              : "Login"}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?{" "}
          <a href="/register">
            Create an account
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;