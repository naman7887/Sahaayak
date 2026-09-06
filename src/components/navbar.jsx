import { useEffect, useState } from "react";

function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setUser(data.user);
        } else {
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Navbar error:", error);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <nav className="navbar">

      <div className="logo">
        Sahaayak
      </div>

      <div className="nav-links">
        <a href="/">Home</a>
        <a href="#">Find Services</a>
        <a href="#">Become a Provider</a>
        <a href="#">About</a>
      </div>

      <div className="nav-buttons">

        {user ? (
          <>
            <a href="/dashboard" className="user-name">
              👤 {user.name}
            </a>

            <button
              className="logout-nav-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <a href="/login" className="login-btn">
              Login
            </a>

            <a href="/register" className="signup-btn">
              Sign Up
            </a>
          </>
        )}

      </div>

    </nav>
  );
}

export default Navbar;