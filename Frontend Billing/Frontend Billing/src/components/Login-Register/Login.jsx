import React, { useRef } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import api from "../../api/api";
import logo from "../../assets/Billing.png";
import "./Login.css";

const Login = () => {
  const userRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  const location = useLocation();
  const successMessage = location.state?.successMessage || null;

  async function login(e) {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", {
        identifier: userRef.current.value,
        password: passwordRef.current.value,
      });

      localStorage.setItem("user", JSON.stringify(res.data));

      if (res.data.role === "ADMIN") {
        navigate("/admin-home");
      } else if (res.data.role === "ACCOUNTANT") {
        navigate("/accountant-home");
      } else if (res.data.role === "CUSTOMER") {
        navigate("/customer-home");
      } else {
        navigate("/");
      }
    } catch (err) {
      alert("Invalid username or password");
    }
  }

  return (
    <div className="login-page">
      {/* Form Container */}
      <div className="form-container">
        <form className="login-form" onSubmit={login}>
          <h3 className="form-title">Welcome Back</h3>

          {successMessage && (
            <p className="success-message">{successMessage}</p>
          )}

          <input
            type="text"
            ref={userRef}
            className="form-input"
            placeholder="Email or Username"
            required
          />

          <input
            type="password"
            ref={passwordRef}
            className="form-input"
            placeholder="Password"
            required
          />

          <div className="options">
            <a href="/forgot-password" className="forgot">
              Forgot Password?
            </a>
          </div>

          <button type="submit" className="login-btn">Login</button>

          <p className="create-account">
            Don’t have an account? <a href="/register">Create New Account</a><br />
            <a href="/">Homepage</a>
          </p>
                      

        </form>
      </div>
      <Outlet />
    </div>
  );
};

export default Login;
