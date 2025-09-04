import React from "react";
import { useNavigate } from "react-router-dom";
import "./AccessDenied.css";

const AccessDenied = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleGoHome = () => {
    if (!user) {
      navigate("/", { replace: true });
      return;
    }

    switch (user.role) {
      case "ADMIN":
        navigate("/admin-home", { replace: true });
        break;
      case "ACCOUNTANT":
        navigate("/accountant-home", { replace: true });
        break;
      case "CUSTOMER":
        navigate("/customer-home", { replace: true });
        break;
      default:
        navigate("/", { replace: true });
    }
  };

  return (
    <div className="access-denied-container">
      <h1>403 - Access Denied</h1>
      <p>Oops! 🚫 You don’t have permission to view this page.</p>
      <button onClick={handleGoHome} className="access-btn">
        Go to Home
      </button>
    </div>
  );
};

export default AccessDenied;
