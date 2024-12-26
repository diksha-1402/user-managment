import React, { useState } from "react";
import axios from "axios";
import "../signup.css";
import { useNavigate } from "react-router-dom";
const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });
  const [error, setError] = useState(""); // For validation or server error messages
  const [loading, setLoading] = useState(false); // Loading state
  const [success, setSuccess] = useState(false); // Success message
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear errors as the user types
    setSuccess(false); // Clear success message
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phoneNumber
    ) {
      setError("All fields are required.");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://user-managment-3.onrender.com/v1/user/auth/signup",
        formData
      );
      if (response.data.success === 0) {
        setError(response.data.message); // Show server error message
        setLoading(false);
        return;
      }
      setSuccess(true);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
      }); // Clear form fields
      navigate("/login");
    } catch {
      setError("Signup failed. Please try again later.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      {success && <p className="success-message">Signup successful!</p>}
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="signup-form">
        <input
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          className={`input-field ${
            error && !formData.firstName ? "error" : ""
          }`}
        />
        <input
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          className={`input-field ${
            error && !formData.lastName ? "error" : ""
          }`}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className={`input-field ${error && !formData.email ? "error" : ""}`}
        />
        <input
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          className={`input-field ${
            error && !formData.phoneNumber ? "error" : ""
          }`}
        />
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Signing up..." : "Signup"}
        </button>
      </form>
      <p className="Login-Link">
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
};

export default Signup;
