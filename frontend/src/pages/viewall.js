import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import "../viewAll.css";

const ViewAllVideos = () => {
  const { userId } = useParams(); // Get the userId from the route parameters
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideos = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:8000/v1/user/vedio/${userId}`, // API endpoint with userId
          {
            headers: { "x-authorization": `Bearer ${token}` },
          }
        );
        if (response.data.success === 0) {
          alert(response.data.message);
          return;
        }
        setVideos(response.data.data); // Store the videos
      } catch {
        alert("Failed to fetch videos");
      } finally {
        setLoading(false); // Stop loading
      }
    };
    fetchVideos();
  }, [userId, navigate]);

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" variant="primary" />
        <p>Loading videos...</p>
      </div>
    );
  }

  return (
    <div className="view-all-videos-container">
      <h2>All Videos</h2>
      <button onClick={() => navigate(-1)} className="back-btn">Back</button>
      <div className="video-gallery">
        {videos.map((video, index) => (
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
  );
};

export default ViewAllVideos;
