import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Images/Billing.png";
import "./Homepage.css";

const HomePage = () => {
  return (
    <div className="homepage">
      <header id="header">
        <div className="header-left">
          <div className="header-logo">
            <img src={Logo} alt="Billing logo" />
          </div>
          <div className="header-title">
            <h2>Billing Application</h2>
          </div>
        </div>

        <nav className="header-nav">
          <ul>
            <li><Link to="/login"><button>Sign In</button></Link></li>
            <li><Link to="/register"><button>Register</button></Link></li>
          </ul>
        </nav>
      </header>

      {/* Main Section */}
      <main className="main">
        <section className="main-content">
          <h1>Pay Smarter - Live Better</h1>
          <p>
            Handle all your bills in one place — fast, secure, and available 24/7.
            Track payments in real time and never miss a due date.
          </p>

          <div className="main-features">
            <ul>
              <li>🧾 Track Invoices</li>
              <li>🔔 Smart Reminders</li>
            </ul>
            <ul>
              <li>💳 Multiple Payment Methods</li>
              <li>📍 Real-time Tracking</li>
            </ul>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer" id="contact">
        <p>© 2025 Billing Application. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
