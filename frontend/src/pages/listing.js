import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import "../userlisting.css";

const Profile = () => {
  const [users, setUsers] = useState([]); // State to store the list of users
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const response = await axios.get(
          "https://user-managment-3.onrender.com/v1/user/listing",
          {
            headers: { "x-authorization": `Bearer ${token}` },
          }
        );
        if (response.data.success === 0) {
          alert(response.data.message);
          return;
        }
        setUsers(response.data.data); // Store users and their video data
      } catch {
        alert("Failed to fetch user listing");
      } finally {
        setLoading(false); // Stop loading after fetching data
      }
    };
    fetchUsers();
  }, [navigate]);

  const handleViewAllVideos = (userId) => {
    navigate(`/view-all/${userId}`); // Navigate to View All Videos page for specific user
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" variant="primary" />
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h2 className="page-title">User Listing</h2>
      <div className="user-list">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <div className="user-details">
              <div className="user-image-container">
                <img
                  src={user.image || "/default-profile.png"}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="profile-image"
                />
              </div>
              <h3>
                {user.firstName} {user.lastName}
              </h3>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Phone:</strong> {user.phoneNumber}
              </p>
              <p>
                <strong>About:</strong> {user.about}
              </p>
            </div>
            <div className="video-section">
              <h4>Recent Videos</h4>
              <div className="video-gallery">
                {user.userVedioData.slice(0, 5).map((video, index) => (
                  <div key={index} className="video-item">
                    <p>
                      <strong>{video.title}</strong>
                    </p>
                    <video width="320" height="240" controls>
                      <source src={video.vedioUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ))}
              </div>
              {user.userVedioData.length > 5 && (
                <button
                  onClick={() => handleViewAllVideos(user._id)}
                  className="view-all-btn"
                >
                  View All Videos
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
