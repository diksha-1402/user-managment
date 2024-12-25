import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome to User Management</h1>
      <Link to="/login" style={{ margin: "10px", padding: "10px", display: "inline-block", backgroundColor: "blue", color: "white" }}>
        Login
      </Link>
      <Link to="/signup" style={{ margin: "10px", padding: "10px", display: "inline-block", backgroundColor: "green", color: "white" }}>
        Signup
      </Link>
    </div>
  );
};

export default Home;
