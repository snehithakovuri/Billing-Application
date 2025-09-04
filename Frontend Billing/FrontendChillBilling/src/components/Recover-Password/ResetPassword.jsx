import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import logo2 from "../../assets/Billing.png";
import "./SendLink-ResetPass-button.css";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const token = query.get("token");

  const handleReset = async (e) => {
    e.preventDefault();
    if (!password) {
      setMessage("Password is required");
      return;
    }

    try {
      await axios.post(
        `http://localhost:8080/api/auth/reset-password?token=${token}`,
        { newPassword: password }
      );
      setMessage("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setMessage(err.response?.data || "Invalid or expired token");
    }
  };

  return (
    <div>
      <div className="navbar">
        <div className="navbar-left">
          <img src={logo2} alt="Logo" className="logo" />
        </div>
      </div>

      <div className="login-container">
        <h1>Reset Password</h1>
        <form onSubmit={handleReset}>
          <label>Enter New Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="send-verify-link-reset-pass-btn" type="submit">Reset Password</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
