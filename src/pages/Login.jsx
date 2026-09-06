import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      // Step 1: Login
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
        setLoading(false);
        return;
      }

      // Step 2: Save token
      localStorage.setItem("token", data.token);

      // Step 3: Get logged-in user's actual role
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
        alert("Login successful, but unable to get user details.");
        setLoading(false);
        return;
      }

      const user = meData.user;

      console.log("Logged in user:", user);
      console.log("User role:", user.role);

      alert("Login successful!");

      // Step 4: Redirect based on role
      if (user.role === "worker") {
        window.location.href = "/worker-dashboard";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Cannot connect to the backend.");
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
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?{" "}
          <a href="/register">Create an account</a>
        </p>
      </div>
    </div>
  );
}

export default Login;