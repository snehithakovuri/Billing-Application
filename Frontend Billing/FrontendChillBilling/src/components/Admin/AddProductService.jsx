import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import "./EditUser.css";
import NavbarwithBack from "../NavbarWithBack";

export default function AddProductService() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productName: "",
    type: "PRODUCT",
    price: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateInputs = () => {
    if (!formData.productName.trim()) return alert("Product name required"), false;
    if (!formData.type) return alert("Type required"), false;
    if (!formData.price || isNaN(formData.price)) return alert("Valid price required"), false;
    return true;
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    try {
      await api.post("/products", formData);
      alert("Product/Service added successfully!");
      navigate("/productservice");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add.");
    }
  };

  return (
    <>
    <NavbarwithBack/>
    <div className="edit-user-container">
      <h2>Add Product / Service</h2>
      <form onSubmit={handleAdd}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Type:</label>
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="PRODUCT">Product</option>
            <option value="SERVICE">Service</option>
          </select>
        </div>
        <div className="form-group">
          <label>Price / Unit:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="update-btn">ADD</button>
        </div>
      </form>
    </div>
    </>
  );
}
