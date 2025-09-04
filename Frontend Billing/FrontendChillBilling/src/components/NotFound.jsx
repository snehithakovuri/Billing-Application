import React from "react";
import { useNavigate } from "react-router-dom";
import "./NotFound.css";
import dogImg from "../assets/404-image.png";

const NotFound = () => {
  const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const handleReturn = () => {
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
    <div className="notfound-container">
      <img src={dogImg} alt="Dog holding 404 sign" className="notfound-dog" />
      <h1 className="notfound-title">Page not found</h1>
      <button className="notfound-btn" onClick={handleReturn}>
        Return
      </button>
    </div>
  );
};

export default NotFound;
