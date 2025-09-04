import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/Billing.png";
import "../Admin/AdminHome.css";

const CustomerHome = () => {
  const navigate = useNavigate();
    const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="header-left">
          <div className="header-logo">
            <img src={logo} alt="Billing logo" />
          </div>
          <div className="header-title">
            <h2>Billing Application</h2>
          </div>
        </div>
        <div className="nav-links">
          
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>
      

      {/* Main Content */}
      <div className="admin-home-container">
        <div class="background"></div>
        <div className="content">
          <h2>Welcome to Billing Application</h2>
          <p>
Manage all your bills in one place — securely access invoices, track payments, and stay on top of your dues with ease and convenience.          </p>
          <button className="go-dashboard-btn" onClick={()=> navigate("/customerdashboard")}>
            Go to Dashboard
          </button>
        </div>
      </div>

    </>
  );
};

export default CustomerHome;
