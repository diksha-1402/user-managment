import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import "../profile.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allVideos, setAllVideos] = useState([]); // State to store all videos
  const [loadingVideos, setLoadingVideos] = useState(false); // Loading state for videos
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
      } catch {
        alert("Failed to fetch profile");
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

  const handleViewAllVideos = () => {
    if (!profile) return;
    navigate(`/view-all/${profile._id}`); // Navigate to the View All Videos page with the userId
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
      <div className="profile-info">
        <p><strong>Name:</strong> {profile.firstName} {profile.lastName}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Phone:</strong> {profile.phoneNumber}</p>
        <p><strong>About:</strong> {profile.about}</p>
      </div>
      <div className="profile-actions">
        <button onClick={() => navigate("/update-profile")}>Update Profile</button>
        <button onClick={() => navigate("/upload-video")}>Upload Video</button>
        <button onClick={() => navigate("/change-password")}>Change Password</button>
        <button onClick={() => navigate("/listing")}>User Listing</button>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <h3>Recent Videos</h3>
      <div className="video-gallery">
        {profile.userVedioData.slice(0, 5).map((video, index) => (
          <div key={index} className="video-item">
            <p><strong>{video.title}</strong></p>
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

      {allVideos.length > 0 && (
        <div className="all-videos">
          <h3>All Videos</h3>
          <div className="video-gallery">
            {allVideos.map((video, index) => (
              <div key={index} className="video-item">
                <p><strong>{video.title}</strong></p>
                <p>{video.description}</p>
                <video width="320" height="240" controls>
                  <source src={video.vedioUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
