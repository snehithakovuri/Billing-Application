import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import "./EditUser.css";
import NavbarwithBack from "../../components/NavbarWithBack";

export default function AddCustomer() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    emailId: "",
    phoneNumber: "",
    username: "",
    passwordHash: "",
    confirmPassword: "",
  });

  const [originalData] = useState(formData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

const validateInputs = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const usernameRegex = /^[a-zA-Z0-9._]+$/;

  if (!formData.fullName.trim()) {
    alert("Full name is required");
    return false;
  }

  if (!emailRegex.test(formData.emailId)) {
    alert("Please enter a valid email address.");
    return false;
  }

  if (!formData.phoneNumber.trim() || formData.phoneNumber.length < 10) {
    alert("Valid phone number is required (10 digits).");
    return false;
  }

  if (!formData.username.trim() || formData.username.length < 6) {
    alert("A minimum 6 characters username is required.");
    return false;
  }

  if (!usernameRegex.test(formData.username)) {
    alert(
      "Username can only contain letters, numbers, dot (.) and underscore (_), and no spaces."
    );
    return false;
  }

  if (!formData.passwordHash || formData.passwordHash.length < 6) {
    alert("Password must be at least 6 characters.");
    return false;
  }

  if (formData.passwordHash !== formData.confirmPassword) {
    alert("Passwords do not match.");
    return false;
  }

  return true;
};


  const handleAdd = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    const payload = {
      fullName: formData.fullName,
      emailId: formData.emailId,
      phoneNumber: formData.phoneNumber,
      username: formData.username,
      passwordHash: formData.passwordHash,
    };

    try {
      await api.post("/users/customers", payload);
      alert("Customer added successfully!");
      navigate(-1);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Customer not added, something went wrong"
      );
    }
  };

  const handleReset = () => setFormData(originalData);

  return (
    <>
      <NavbarwithBack />
      <div className="edit-user-container">
        <h2>Add Customer</h2>

        <form onSubmit={handleAdd}>
          <div className="form-group">
            <label>Full Name:</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Id:</label>
            <input
              type="text"
              name="emailId"
              value={formData.emailId}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number:</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="passwordHash"
              value={formData.passwordHash}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleReset} className="reset-btn">
              Reset
            </button>
            <button type="submit" className="update-btn">
              ADD
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
