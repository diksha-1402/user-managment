import axios from "axios";

const API_BASE_URL = "http://localhost:8000/v1";

export const signup = (data) =>
  axios.post(`${API_BASE_URL}/user/auth/signup`, data);
export const login = (data) =>
  axios.post(`${API_BASE_URL}/user/auth/login`, data);
export const getProfile = (token) =>
  axios.get(`${API_BASE_URL}/user/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const updateProfile = (token, data) =>
  axios.put(`${API_BASE_URL}/user/profile`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const uploadVideo = (token, file) => {
  const formData = new FormData();
  formData.append("video", file);
  return axios.post(`${API_BASE_URL}/user/upload`, formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
