import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api/api";
import "./EditUser.css";
import NavbarwithBack from "../../components/NavbarWithBack";

export default function EditUser() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user;

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    emailId: user?.email || "",
    phoneNumber: user?.phone || "",
    username: user?.username || "",
    passwordHash: "", 
    role: user?.role || "",
    status: user?.status || ""
  });

  const [originalData] = useState(formData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateInputs = () => {
    const usernameRegex = /^[a-zA-Z0-9._]+$/;
    if (!formData.fullName.trim()) {
      alert("Full name is required");
      return false;
    }
    if (!formData.emailId.trim() || !/\S+@\S+\.\S+/.test(formData.emailId)) {
      alert("Valid email is required");
      return false;
    }
    if (!formData.phoneNumber.trim() || formData.phoneNumber.length < 8) {
      alert("Valid phone number is required");
      return false;
    }
    if (!formData.username.trim() || formData.username.length < 6) {
    alert("A minimum 6 characters username is required.");
      return false;
    }

    if (!usernameRegex.test(formData.username)) {
      alert(
        "Username can only contain letters, numbers, dot (.) and underscore (_), and must not contain spaces or special characters."
      );
      return false;
    }
    if (!formData.role) {
      alert("Role is required");
      return false;
    }
    if (!formData.status) {
      alert("Status is required");
      return false;
    }
    return true;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    try {
      await api.put("/users", formData);
      alert("User updated successfully!");
      navigate("/usermanagement");
    } catch (error) {
      console.error("Error updating user:", error);
      if (error.response?.data?.message) {
        alert(`User not updated: ${error.response.data.message}`);
      } else {
        alert("User not updated, something went wrong");
      }
    }
  };

  const handleReset = () => {
    setFormData(originalData);
  };

  return (
    <>
      <NavbarwithBack />
      <div className="edit-user-container">
        <h2>Edit User</h2>

        <form onSubmit={handleUpdate}>
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
            <input type="text" name="emailId" value={formData.emailId} readOnly />
          </div>

          <div className="form-group">
            <label>Phone:</label>
            <input type="text" name="phoneNumber" value={formData.phoneNumber} readOnly />
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
            <label>Role:</label>
            <select name="role" value={formData.role} onChange={handleChange} required>
              <option value="ADMIN">Admin</option>
              <option value="ACCOUNTANT">Accountant</option>
              <option value="CUSTOMER">Customer</option>
            </select>
          </div>

          <div className="form-group">
            <label>Status:</label>
            <select name="status" value={formData.status} onChange={handleChange} required>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleReset} className="reset-btn">Reset</button>
            <button type="submit" className="update-btn">UPDATE</button>
          </div>
        </form>
      </div>
    </>
  );
}
