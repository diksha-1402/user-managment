import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../login.css";

const Login = () => {
  const [formData, setFormData] = useState({ firstName: "", password: "" });
  const [error, setError] = useState(""); // Error message state
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.password) {
      setError("Both fields are required");
      return;
    }

    setLoading(true); // Start loading
    try {
      const response = await axios.post(
        "http://localhost:8000/v1/user/auth/login",
        formData
      );
      if (response.data.success === 0) {
        setError(response.data.message);
        setLoading(false);
        return;
      }
      localStorage.setItem("token", response.data.data.token);
      navigate("/profile");
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          name="firstName"
          type="text"
          placeholder="First Name"
          onChange={handleChange}
          className={`input-field ${error && !formData.firstName ? "error" : ""}`}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className={`input-field ${error && !formData.password ? "error" : ""}`}
        />
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="signup-link">
        Don't have an account? <a href="/signup">Sign up</a>
      </p>
    </div>
  );
};

export default Login;
