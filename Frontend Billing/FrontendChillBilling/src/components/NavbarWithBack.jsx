import React from "react";
import { useNavigate } from "react-router-dom";
import "./NavbarWithBack.css";
import logochill from "../assets/Billing.png"


const NavbarwithBack = ({ showBack = true }) => {
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <div className="navbar-left">
        <img src={logochill} alt="Logo" className="logo" />
      </div>
      <div className="navbar-right">
        {showBack && (
          <button className="back-btn" onClick={() => navigate(-1)}>
            Back
          </button>
        )}
      </div>
    </div>
  );
};

export default NavbarwithBack;
