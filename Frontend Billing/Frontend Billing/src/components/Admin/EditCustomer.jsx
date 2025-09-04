import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api/api";
import "./EditUser.css"; 
import NavbarwithBack from "../../components/NavbarWithBack";

export default function EditCustomer() {
  const navigate = useNavigate();
  const location = useLocation();
  const customer = location.state?.customer;

  const [formData, setFormData] = useState({
    fullName: customer?.name || "",
    emailId: customer?.email || "",
    phoneNumber: customer?.phone || "",
    username: customer?.username || "",
    status: customer?.status === "ACTIVE" ? "Active" : "Inactive",
  });

  const [originalData] = useState(formData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const validateInputs = () => {
    const usernameRegex = /^[a-zA-Z0-9._]+$/;
    if (!formData.fullName.trim()) return alert("Full name is required"), false;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailId))
      return alert("Valid email is required"), false;
    if (!formData.phoneNumber.trim() || formData.phoneNumber.length < 8)
      return alert("Valid phone number is required"), false;
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
    if (!formData.status) return alert("Status is required"), false;
    return true;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    const payload = {
      fullName: formData.fullName,
      emailId: formData.emailId,
      username: formData.username,
      status:
        formData.status === "Active"
          ? "ACTIVE"
          : formData.status === "Inactive"
          ? "INACTIVE"
          : formData.status,
    };

    try {
      await api.put("/users/customers", payload);
      alert("Customer updated successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Error updating customer:", error);
      alert(
        error.response?.data?.message ||
          "Customer not updated, something went wrong"
      );
    }
  };

  const handleReset = () => setFormData(originalData);

  return (
    <>
      <NavbarwithBack />
      <div className="edit-user-container">
        <h2>Edit Customer</h2>

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
            <input
              type="text"
              name="emailId"
              value={formData.emailId}
              readOnly
            />
          </div>

          <div className="form-group">
            <label>Phone:</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              readOnly
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
            <label>Status:</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="status"
                  value="Active"
                  checked={formData.status === "Active"}
                  onChange={handleChange}
                />
                Active
              </label>
              <label>
                <input
                  type="radio"
                  name="status"
                  value="Inactive"
                  checked={formData.status === "Inactive"}
                  onChange={handleChange}
                />
                Inactive
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleReset} className="reset-btn">
              Reset
            </button>
            <button type="submit" className="update-btn">
              UPDATE
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
