import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api/api";
import "./EditUser.css";
import NavbarwithBack from "../NavbarWithBack";

export default function EditProductService() {
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state?.product;

const [formData, setFormData] = useState({
  productId:product?.id || "",
  productName: product?.productName || "",
  type: product?.type || "",
  price: product?.price || "",
});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateInputs = () => {
    if (!formData.productName.trim())
      return alert("Product name required"), false;
    if (!formData.type) return alert("Type required"), false;
    if (!formData.price || isNaN(formData.price))
      return alert("Valid price required"), false;
    return true;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    try {
      await api.put("/products", formData);
      alert("Updated successfully!");
      navigate("/productservice");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update.");
    }
  };

  return (
    <>
      <NavbarwithBack />
      <div className="edit-user-container">
        <h2>Edit Product / Service</h2>
        <form onSubmit={handleUpdate}>
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
            <button type="submit" className="update-btn">
              UPDATE
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
