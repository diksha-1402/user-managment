import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../updateProfile.css"; // For styling

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    about: "",
    email: "", // Add email field
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const response = await axios.get("http://localhost:8000/v1/user/profile", {
          headers: { "x-authorization": `Bearer ${token}` },
        });
        if (response.data.success === 0) {
          setError(response.data.message);
          return;
        }
        setFormData(response.data.data); // Autofill form fields with profile data
      } catch {
        setError("Failed to fetch profile.");
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    // Prepare only the fields to be updated
    const updatedData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
     
      about: formData.about,
      phoneNumber: formData.phoneNumber,
    };

    setLoading(true);
    try {
      const response = await axios.patch(
        "http://localhost:8000/v1/user/update-profile",
        updatedData,
        {
          headers: { "x-authorization": `Bearer ${token}` },
        }
      );
      if (response.data.success === 0) {
        setError(response.data.message);
        setLoading(false);
        return;
      }
      setSuccess(true);
      setError("");
      setTimeout(() => navigate("/profile"), 2000);
    } catch {
      setError("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-profile-container">
      <h2>Update Profile</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">Profile updated successfully!</p>}
      <form onSubmit={handleSubmit} className="update-profile-form">
        <input
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="First Name"
          className={`input-field ${error && !formData.firstName ? "error" : ""}`}
        />
        <input
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          className={`input-field ${error && !formData.lastName ? "error" : ""}`}
        />
         <input
          name="email"
          value={formData.email}
          readOnly
          className="input-field readonly-field"
          placeholder="Email"
        />
        <input
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="Phone Number"
          className={`input-field ${error && !formData.phoneNumber ? "error" : ""}`}
        />
        <textarea
          name="about"
          value={formData.about}
          onChange={handleChange}
          placeholder="About"
          className={`textarea-field ${error && !formData.about ? "error" : ""}`}
        />
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;
