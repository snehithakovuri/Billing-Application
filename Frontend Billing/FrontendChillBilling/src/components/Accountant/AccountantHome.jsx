import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/Billing.png";
import "../Admin/AdminHome.css";

const AdminHome = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      <nav className="navbar">
        <div className="header-left">
          <div className="header-logo">
            <img src={Logo} alt="Billing logo" />
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

      <div className="admin-home-container">
        <div class="background"></div>
        <div className="content">
          <h2>Welcome to Billing Application</h2>
<p>
  Simplify the way you handle billing and payments. 
  Create invoices in seconds, track expenses effortlessly, 
  and manage customers with ease — all in one secure platform.
</p>

          <button
            className="go-dashboard-btn"
            onClick={() => navigate("/accountantdashboard")}
          >
            Go to Dashboard
          </button>
        </div>
      </div>

    </>
  );
};

export default AdminHome;
