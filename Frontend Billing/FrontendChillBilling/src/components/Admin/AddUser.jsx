import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import "./AddUser.css";
import NavbarwithBack from "../../components/NavbarWithBack";

export default function AddUser() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    emailId: "",
    phoneNumber: "",
    username: "",
    passwordHash: "",
    confirmPassword: "",
    role: ""
  });

  const [originalData] = useState(formData); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
      "Username can only contain letters, numbers, dot (.) and underscore (_), and must not contain spaces."
    );
    return false;
  }

  if (!formData.passwordHash || formData.passwordHash.length < 6) {
    alert("Password must be at least 6 characters long.");
    return false;
  }

  if (formData.passwordHash !== formData.confirmPassword) {
    alert("Passwords do not match");
    return false;
  }

  if (!formData.role) {
    alert("Role is required");
    return false;
  }

  return true;
};


  const handleAdd = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    const reqBody = {
      fullName: formData.fullName,
      emailId: formData.emailId,
      phoneNumber: formData.phoneNumber,
      username: formData.username,
      passwordHash: formData.passwordHash,
      role: formData.role
    };

    try {
      await api.post("/users", reqBody);
      alert("User added successfully!");
      navigate("/usermanagement");
    } catch (error) {
      console.error("Error adding user:", error);
      if (error.response?.data?.message) {
        alert(`User not added: ${error.response.data.message}`);
      } else {
        alert("User not added, something went wrong");
      }
    }
  };

  const handleReset = () => {
    setFormData(originalData);
  };

  return (
    <>
      <NavbarwithBack />
      <div className="add-user-container">
        <h2>Add User</h2>

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
            <label>Email:</label>
            <input
              type="text"
              name="emailId"
              value={formData.emailId}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone:</label>
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

          <div className="form-group">
            <label>Role:</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Role --</option>
              <option value="ADMIN">Admin</option>
              <option value="ACCOUNTANT">Accountant</option>
              <option value="CUSTOMER">Customer</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleReset} className="reset-btn">
              Reset
            </button>
            <button type="submit" className="add-btn">
              ADD
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
