import React, { useState } from "react";
import axios from "axios";
import NavbarwithBack from "../NavbarWithBack";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage("Email is required");
      return;
    }
    try {
      await axios.post("http://localhost:8080/api/auth/forgot-password", {
        email,
      });
      setMessage("Password reset link sent to your email!");
    } catch (err) {
      setMessage(err.response?.data || "User not found");
    }
  };

  return (
    <div>
      <NavbarwithBack showBack={true} /> 
      <div className="login-container">
        <h1>Forgot Password</h1>
        <form onSubmit={handleSubmit}>
          <label>Enter your email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className="send-verify-link-reset-pass-btn" type="submit">Send Verification Link</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
