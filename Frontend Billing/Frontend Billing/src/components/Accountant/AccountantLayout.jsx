import React from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./AccountantLayout.css";
import logo from "../../assets/Billing.png";
import { FaUser } from "react-icons/fa";

const sidebarMenu = [
  { label: "Customer Management", link: "/customer-management" },
  { label: "Invoice Management", link: "/invoice-management" },
  { label: "Payments Tracking", link: "/payments-tracking" },
  { label: "Reporting & Analytics", link: "/reporting-analytics" },
  { label: "Profile", link: "/my-profile" },
];

export default function AccountantLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const username = storedUser?.username || "Guest";

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="accountant-dashboard-container">
      <header className="accountant-dashboard-header">
        <div className="accountant-header-content">
          <div className="accountant-logo-container" onClick={() => navigate("/accountant-home")}>
            <img src={logo} alt="App Logo" className="accountant-app-logo" />
          </div>

          <div className="accountant-user-actions">
            <span className="accountant-user-info">
              <span className="accountant-user-avatar" role="img" aria-label="user">
                <FaUser />
              </span>
              {username}
            </span>
            <button className="accountant-home-btn" onClick={() => navigate("/accountant-home")}>
              Home
            </button>
            <button className="accountant-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="accountant-dashboard-main">
        <aside className="accountant-dashboard-sidebar">
          <nav>
            <ul className="accountant-sidebar-nav">
              {sidebarMenu.map((item) => {
                const active = location.pathname === item.link;
                return (
                  <li
                    key={item.label}
                    className={`accountant-sidebar-item ${active ? "active" : ""}`}
                  >
                    <NavLink
                      to={item.link}
                      className={`accountant-sidebar-link ${active ? "active" : ""}`}
                    >
                      {item.label}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        <main className="accountant-dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
