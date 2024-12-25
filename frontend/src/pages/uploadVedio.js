import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../uploadVedio.css"; // For styling

const UploadVideo = () => {
  const [formData, setFormData] = useState({
    vedio: null,
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(false); // Loader state
  const [preview, setPreview] = useState(null); // Video preview
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== "video/mp4") {
      alert("Only MP4 files are supported");
      return;
    }
    setFormData((prev) => ({ ...prev, vedio: file }));
    setPreview(URL.createObjectURL(file)); // Create a preview URL
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const { vedio, title, description } = formData;

    if (!vedio || !title || !description) {
      alert("All fields are required, including a valid MP4 video file.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const data = new FormData();
    data.append("vedio", vedio);
    data.append("title", title);
    data.append("description", description);

    setLoading(true); // Start loader
    try {
      await axios.post("http://localhost:8000/v1/user/upload", data, {
        headers: {
          "x-authorization": `Bearer ${token}`, // Correct header key
          "Content-Type": "multipart/form-data", // Ensure proper content type
        },
      });
      alert("Video uploaded successfully!");
      setFormData({ vedio: null, title: "", description: "" });
      setPreview(null); // Clear preview
      navigate("/profile");
    } catch (error) {
      console.error(error);
      alert("Failed to upload video");
    } finally {
      setLoading(false); // Stop loader
    }
  };

  return (
    <div className="upload-video-container">
      <h2>Upload Video</h2>
      <form onSubmit={handleUpload} className="upload-video-form">
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter video title"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter video description"
            rows="4"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="vedio">Select MP4 Video:</label>
          <input
            type="file"
            id="vedio"
            accept="video/mp4"
            onChange={handleFileChange}
            required
          />
        </div>
        {preview && (
          <div className="video-preview">
            <p>Video Preview:</p>
            <video src={preview} controls width="100%" />
          </div>
        )}
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
      {loading && <p className="loading-message">Uploading video, please wait...</p>}
    </div>
  );
};

export default UploadVideo;
