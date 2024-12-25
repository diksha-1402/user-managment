import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../changePassword.css"; // For styling

const ChangePassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState(""); // Error message
  const [success, setSuccess] = useState(""); // Success message
  const [loading, setLoading] = useState(false); // Loading state

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error when user types
    setSuccess(""); // Clear success message
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { newPassword, confirmPassword, oldPassword } = formData;

    // Validation checks
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true); // Start loading
    try {
      const response = await axios.patch(
        "http://localhost:8000/v1/user/auth/change-password",
        formData, // Only send required fields
        {
          headers: { "x-authorization": `Bearer ${token}` },
        }
      );

      if (response.data.success === 0) {
        setError(response.data.message);
        setLoading(false);
        return;
      }

      setSuccess("Password changed successfully!");
      setError(""); // Clear error
      setTimeout(() => navigate("/profile"), 2000); // Redirect after success
    } catch {
      setError("Failed to change password.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="change-password-container">
      <h2>Change Password</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleSubmit} className="change-password-form">
        <input
          name="oldPassword"
          type="password"
          placeholder="Current Password"
          value={formData.oldPassword}
          onChange={handleChange}
          className={`input-field ${error && !formData.oldPassword ? "error" : ""}`}
        />
        <input
          name="newPassword"
          type="password"
          placeholder="New Password"
          value={formData.newPassword}
          onChange={handleChange}
          className={`input-field ${error && !formData.newPassword ? "error" : ""}`}
        />
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className={`input-field ${error && !formData.confirmPassword ? "error" : ""}`}
        />
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Updating..." : "Change Password"}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
