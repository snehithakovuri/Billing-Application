import React from "react";
import { useNavigate } from "react-router-dom";
// import logochill from "../assets/logo2.jpg"
import logochill from "../assets/Billing.png";

import "./SessionTimeout.css";

const SessionTimeout = () => {
  const navigate = useNavigate();

  return (
      <main>
      <div className="navbar">
          <div className="navbar-left">
            <img src={logochill} alt="Logo" className="logo" />
          </div>
      </div>
    <div className="timeout-container">
      <div className="timeout-card">
        <h1>Session Expired ❌</h1>
        <p>Your session has timed out for security reasons. Please log in again.</p>
        <button className="go-login-btn" onClick={() => navigate("/")}>
          Go to Login
        </button>
      </div>
    </div>
      </main>
  );
};

export default SessionTimeout;
