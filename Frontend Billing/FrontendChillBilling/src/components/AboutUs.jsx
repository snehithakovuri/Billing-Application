import React from "react";
import logo from "../assets/Billing.png";
import "./AboutUs.css";
import { useNavigate } from "react-router-dom";

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <>
      <nav className="navbar">
        <div>
          <img className="logo" src={logo} alt="logo not found" />
        </div>
          <button className="logout-btn" onClick={() => navigate(-1)}>
            Back
          </button>
      </nav>

      <div className="about-hero">
        <h1>About Chill Billing</h1>
        <p>
          Chill Billing is a streamlined, secure, and scalable solution for
          managing invoices, payments, and customers. We simplify financial
          management so you can focus on growing your business.
        </p>
      </div>

      <div className="features">
        <h2>Our Key Functionalities</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>📑 Invoicing</h3>
            <p>
              Create and send professional invoices in seconds and track their status in real-time.
            </p>
          </div>
          <div className="feature-card">
            <h3>💰 Payments</h3>
            <p>
              Accept secure online payments. Get paid faster with multiple
              payment options integrated directly into your invoices.
            </p>
          </div>
          <div className="feature-card">
            <h3>👥 Customer Management</h3>
            <p>
              Manage all your clients in one place. Keep track of their
              invoices and payments effortlessly.
            </p>
          </div>
          <div className="feature-card">
            <h3>⚙️ Automation</h3>
            <p>
              Automate payment reminders and overdue notice to save time and reduce manual work.
            </p>
          </div>
          <div className="feature-card">
            <h3>📊 Reports</h3>
            <p>
              Generate detailed financial reports to analyze revenue, profits
              and customer trends. Make data-driven business decisions.
            </p>
          </div>
          <div className="feature-card">
            <h3>🔒 Security</h3>
            <p>
              Your data is safe with us. Our platform is designed with
              top-notch security to ensure privacy and compliance.
            </p>
          </div>
        </div>
      </div>

      <div className="about-closing">
        <h2>Our Mission</h2>
        <p>
          We are committed to helping freelancers, startups, and enterprises
          streamline their billing processes, reduce manual errors, and get paid
          faster. With Chill Billing, managing your finances has never been
          easier.
        </p>
      </div>


    </>
  );
};

export default AboutUs;
