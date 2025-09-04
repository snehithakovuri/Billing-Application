import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { useParams, useNavigate } from "react-router-dom";
import "./EditInvoice.css";
import NavbarwithBack from "../NavbarWithBack";

export default function EditInvoice() {
  const { invoiceNumber } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    dueDate: "",
    paidAmount: 0,
    items: [],
  });

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await api.post("/invoices/by-invoice-number", {
          invoiceNumber,
        });
        const inv = res.data;

        setFormData({
          invoiceNumber: inv.invoiceNumber,
          dueDate: inv.dueDate,
          paidAmount: inv.paidAmount || 0,
          items: (inv.items || []).map((i) => ({
            productName: i.product?.productName || "",
            quantity: i.quantity || 1,
          })),
        });
      } catch (err) {
        console.error("Error fetching invoice:", err);
        alert("Invoice not found.");
        const user = JSON.parse(localStorage.getItem("user"));

        if (user?.role === "ACCOUNTANT") {
          navigate("/invoice-management");
        } else if (user?.role === "ADMIN") {
          navigate("/invoicemanagement");
        } else {
          navigate("/");
        }
      }
    };
    fetchInvoice();
  }, [invoiceNumber, navigate]);

  // Fetch product list
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  const handleProductChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;
    setFormData({ ...formData, items: updatedItems });
  };

  const updateQuantity = (index, change) => {
    const updatedItems = [...formData.items];
    updatedItems[index].quantity = Math.max(
      1,
      updatedItems[index].quantity + change
    );
    setFormData({ ...formData, items: updatedItems });
  };

  const removeProduct = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: updatedItems });
  };

  const addProductRow = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productName: "", quantity: 1 }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put("/invoices", formData);
      if (response.data) {
        alert(response.data);
      } else {
        alert("Invoice updated successfully!");
      }
      navigate(-1);
    } catch (error) {
      console.error("Error updating invoice:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(error.response.data.message);
      } else {
        alert("Failed to update invoice.");
      }
    }
  };

  return (
    <>
      <NavbarwithBack />
      <div className="edit-invoice-container">
        <h2>Edit Invoice</h2>
        <form onSubmit={handleSubmit} className="invoice-form">
          <div className="form-group">
            <label>Invoice Number:</label>
            <input type="text" value={formData.invoiceNumber} disabled />
          </div>

          <div className="form-group">
            <label>Due Date:</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Products:</label>
            <div className="product-section">
              {formData.items.map((item, index) => (
                <div key={index} className="product-row">
                  <select
                    value={item.productName}
                    onChange={(e) =>
                      handleProductChange(index, "productName", e.target.value)
                    }
                    required
                  >
                    <option value="">Select Product</option>
                    {products.map((p) => (
                      <option key={p.productId} value={p.productName}>
                        {p.productName}
                      </option>
                    ))}
                  </select>

                  <div className="quantity-controls">
                    <button
                      type="button"
                      onClick={() => updateQuantity(index, -1)}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(index, +1)}
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeProduct(index)}
                  >
                    ❌
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="add-product-btn"
                onClick={addProductRow}
              >
                + Add Product
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Paid Amount:</label>
            <input
              type="number"
              value={formData.paidAmount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  paidAmount: parseFloat(e.target.value),
                })
              }
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="update-btn">
              Update Invoice
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
