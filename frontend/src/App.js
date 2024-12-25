import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Profile from "./pages/profile";
import UpdateProfile from "./pages/updateProfile";
import ChangePassword from "./pages/changePassword";
import UploadVideo from "./pages/uploadVedio";
import ViewAllVideos from "./pages/viewall";
import UserListing from "./pages/listing";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/update-profile" element={<UpdateProfile />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/upload-video" element={<UploadVideo />} />
        <Route path="/view-all/:userId" element={<ViewAllVideos />} />
        <Route path="/listing" element={<UserListing />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
