import React from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./CustomerLayout.css";
import logo from "../../assets/Billing.png";
import { FaUser } from "react-icons/fa";

const sidebarMenu = [
  { label: "Profile", link: "/profile" },
  { label: "Invoices", link: "/customerinvoices" },
  { label: "Make Payment", link: "/makepayment" },
  { label: "Payment History", link: "/paymentshistory" },
];

export default function CustomerLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const username = storedUser?.username || "Customer";

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          {/* Logo */}
          <div className="logo-container" onClick={() => navigate("/customer-home")}>
            <img src={logo} alt="App Logo" className="app-logo" />
          </div>

          {/* User + Buttons */}
          <div className="user-actions">
            <span className="user-info">
              <span className="user-avatar" role="img" aria-label="user">
                <FaUser />
              </span>
              {username}
            </span>
            <button className="home-btn" onClick={() => navigate("/customer-home")}>
              Home
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar + Content */}
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
