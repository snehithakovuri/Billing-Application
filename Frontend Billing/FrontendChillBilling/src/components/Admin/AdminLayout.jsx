import React from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./AdminLayout.css";
import logo from "../../assets/Billing.png";
import {FaUser} from "react-icons/fa";


const sidebarMenu = [
  { label: "User Management", link: "/usermanagement" },
  { label: "Customer Management", link: "/customermanagement" },
  { label: "Product/Service Catalog", link: "/productservice" },
  { label: "Invoice Management", link: "/invoicemanagement" },
  { label: "Payment Tracking", link: "/paymentstracking" },
  { label: "Reporting & Analytics", link: "/reportinganalytics" },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const username = storedUser?.username || "Guest";

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="logo-container" onClick={() => navigate("/admin-home")}>
            <img src={logo} alt="App Logo" className="app-logo" />
          </div>

          <div className="user-actions">
            <span className="user-info">
              <span className="user-avatar" role="img" aria-label="user">
                <FaUser/>
              </span>
              {username}
            </span>
            <button className="home-btn" onClick={() => navigate("/admin-home")}>
              Home
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-main">
        <aside className="dashboard-sidebar">
          <nav>
            <ul className="sidebar-nav">
              {sidebarMenu.map((item) => {
                const active = location.pathname === item.link;
                return (
                  <li
                    key={item.label}
                    className={`sidebar-item ${active ? "active" : ""}`}
                  >
                    <NavLink
                      to={item.link}
                      className={`sidebar-link ${active ? "active" : ""}`}
                    >
                      {item.label}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
