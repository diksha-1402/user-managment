import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import "../profile.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [image, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:8000/v1/user/profile",
          {
            headers: { "x-authorization": `Bearer ${token}` },
          }
        );

        if (response.data.success === 0) {
          alert(response.data.message);
          return;
        }

        setProfile(response.data.data);
        setProfileImage(response.data.data.image || null);
      } catch (error) {
        console.error("Error fetching profile:", error);
        alert("Failed to fetch profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Do you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem("token");
      alert("Logged out successfully!");
      navigate("/");
    }
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file.");
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        alert("File size must be less than 2MB.");
        return;
      }

      setPreviewImage(URL.createObjectURL(file));
      setProfileImage(file);
    }
  };

  const handleUploadProfileImage = async () => {
    if (!image) {
      alert("Please select a profile image to upload.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.patch(
        "http://localhost:8000/v1/user/upload-profile",
        formData,
        {
          headers: {
            "x-authorization": `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === 0) {
        alert(response.data.message);
        return;
      }

      alert("Profile image uploaded successfully!");
      setProfile((prev) => ({
        ...prev,
        image: response.data.data,
      }));
      setPreviewImage(null);
      navigate("/profile");
      return;
    } catch (error) {
      console.error("Error uploading profile image:", error);
      alert("Failed to upload profile image. Please try again.");
    }
  };

  const handleViewAllVideos = () => {
    if (profile) {
      navigate(`/view-all/${profile._id}`);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" variant="primary" />
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h2>Welcome, {profile.firstName}!</h2>

      <div className="profile-header">
        <div className="profile-image-container">
          <img
            src={profile.image || "default-profile.png"}
            alt="Profile"
            className="profile-image"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleProfileImageChange}
            className="profile-image-upload"
          />
          {previewImage && (
            <div className="image-preview">
              <p>Preview:</p>
              <img src={previewImage} alt="Preview" className="preview-image" />
              <button onClick={handleUploadProfileImage} className="upload-btn">
                Upload Profile Image
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="profile-info">
        <p>
          <strong>Name:</strong> {profile.firstName} {profile.lastName}
        </p>
        <p>
          <strong>Email:</strong> {profile.email}
        </p>
        <p>
          <strong>Phone:</strong> {profile.phoneNumber}
        </p>
        <p>
          <strong>About:</strong> {profile.about}
        </p>
      </div>

      <div className="profile-actions">
        <button onClick={() => navigate("/update-profile")}>
          Update Profile
        </button>
        <button onClick={() => navigate("/upload-video")}>Upload Video</button>
        <button onClick={() => navigate("/change-password")}>
          Change Password
        </button>
        <button onClick={() => navigate("/listing")}>User Listing</button>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <h3>Recent Videos</h3>
      <div className="video-gallery">
        {profile.userVedioData?.slice(0, 5).map((video, index) => (
          <div key={index} className="video-item">
            <p>
              <strong>{video.title}</strong>
            </p>
            <p>{video.description}</p>
            <video width="320" height="240" controls>
              <source src={video.vedioUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ))}
      </div>

      <button onClick={handleViewAllVideos} className="view-all-btn">
        View All Videos
      </button>

      {loadingVideos && <Spinner animation="border" variant="primary" />}
    </div>
  );
};

export default Profile;
