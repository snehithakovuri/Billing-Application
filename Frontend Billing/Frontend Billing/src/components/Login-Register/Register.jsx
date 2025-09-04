import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import logo from "../../assets/Billing.png";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.fullName.trim()) return "Full Name is required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      return "Enter a valid email";
    if (!form.phoneNumber.match(/^[6-9]\d{9}$/))
      return "Enter a valid 10-digit phone number starting with 6-9";
    if (!form.username.trim()) return "Username is required";
    if (form.password.length < 6)
      return "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword)
      return "Passwords do not match";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      const { fullName, email, phoneNumber, username, password, confirmPassword } = form;

      await api.post("/auth/register", {
        fullName,
        email,
        phoneNumber,
        username,
        password,
        confirmPassword,
      });

      localStorage.setItem(
        "successMessage",
        "Registration is successful, please check your mail for verification link"
      );

      navigate("/", {
        state: {
          successMessage:
            "Registration successful! Please check your email for verification link.",
        },
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Try again!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      {/* Form Container */}
      <div className="form-container">

        {/* Right Form Section */}
        <form className="register-form" onSubmit={handleSubmit}>
          <h3 className="form-title">Customer Registration</h3>

          <input
            type="text"
            name="fullName"
            className="form-input"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            className="form-input"
            placeholder="Email id"
            value={form.email}
            onChange={handleChange}
          />

          <input
            type="text"
            name="phoneNumber"
            className="form-input"
            placeholder="Phone number"
            value={form.phoneNumber}
            onChange={handleChange}
          />

          <input
            type="text"
            name="username"
            className="form-input"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
          />

          {/* <label className="form-label"> :</label> */}
          <input
            type="password"
            name="password"
            className="form-input"
            placeholder="Enter Password"
            value={form.password}
            onChange={handleChange}
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="confirm Password"
            className="form-input"
            value={form.confirmPassword}
            onChange={handleChange}
          />

          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
          <p className="create-account">
            Already have an account? <a href="/login">Login here</a>
            <p className="create-account"> <a href="/">Homepage</a></p>
          </p>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Register;
