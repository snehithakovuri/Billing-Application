import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import "./AddInvoice.css";
import NavbarwithBack from "../NavbarWithBack";

export default function AddInvoice() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [formData, setFormData] = useState({
    customerEmail: "",
    dueDate: "",
    paidAmount: 0,
    items: [{ productName: "", quantity: 0 }],
  });

  useEffect(() => {
    const fetchProductsAndCustomers = async () => {
      try {
        const productsRes = await api.get("/products");
        const customersRes = await api.get("/users/customers");

        setProducts(productsRes.data);

        const customerOptions = customersRes.data.map((customer) => ({
          email: customer.emailId,
          name: customer.fullName,
        }));
        setCustomers(customerOptions);
        setFilteredCustomers(customerOptions);
      } catch (err) {
        console.error("Error fetching products or customers:", err);
      }
    };

    fetchProductsAndCustomers();
  }, []);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSearchCustomer = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setFormData({ ...formData, customerEmail: e.target.value });
    const filtered = customers.filter(
      (customer) =>
        customer.email.toLowerCase().includes(searchTerm) ||
        customer.name.toLowerCase().includes(searchTerm)
    );
    setFilteredCustomers(filtered);
  };

  const handleSelectCustomer = (email) => {
    setFormData({ ...formData, customerEmail: email });
    setFilteredCustomers([]);
  };

  const handleProductChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;

    if (field === "productName" && value && updatedItems[index].quantity === 0) {
      updatedItems[index].quantity = 1;
    }

    setFormData({ ...formData, items: updatedItems });
  };

  const addProductRow = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productName: "", quantity: 0 }],
    });
  };

  const updateQuantity = (index, change) => {
    const updatedItems = [...formData.items];

    if (updatedItems[index].productName) {
      updatedItems[index].quantity = Math.max(1, updatedItems[index].quantity + change);
      setFormData({ ...formData, items: updatedItems });
    }
  };

  const removeProductRow = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: updatedItems });
  };

  const resetForm = () => {
    setFormData({
      customerEmail: "",
      dueDate: "",
      paidAmount: 0,
      items: [{ productName: "", quantity: 0 }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (let item of formData.items) {
      if (item.productName && item.quantity < 1) {
        alert(`Quantity for ${item.productName} must be at least 1`);
        return;
      }
    }

    try {
      await api.post("/invoices", formData);
      alert("Invoice created successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Error creating invoice:", error);
      alert("Failed to create invoice.");
    }
  };

  return (
    <>
      <NavbarwithBack />
      <div className="add-invoice-container">
        <h2>Create Invoice</h2>
        <form onSubmit={handleSubmit} className="invoice-form">
          <label>Customer Email:</label>
          <input
            type="text"
            value={formData.customerEmail}
            onChange={handleSearchCustomer}
            required
            placeholder="Search customer by email or name"
            list="customer-list"
          />
          <datalist id="customer-list">
            {filteredCustomers.length > 0 &&
              filteredCustomers.map((customer, index) => (
                <option
                  key={index}
                  value={customer.email}
                  onClick={() => handleSelectCustomer(customer.email)}
                >
                  {customer.email} ({customer.name})
                </option>
              ))}
          </datalist>

          <label>Due Date:</label>
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleChange("dueDate", e.target.value)}
            required
          />

          <div className="product-section">
            <label>Products / Services:</label>
            {formData.items.map((item, index) => (
              <div key={index} className="product-row">
                <select
                  value={item.productName}
                  onChange={(e) => handleProductChange(index, "productName", e.target.value)}
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
                  <button type="button" onClick={() => updateQuantity(index, -1)}>
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button type="button" onClick={() => updateQuantity(index, +1)}>
                    +
                  </button>
                </div>

                {formData.items.length > 1 && (
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeProductRow(index)}
                  >
                    ❌
                  </button>
                )}
              </div>
            ))}

            <button type="button" className="add-product-btn" onClick={addProductRow}>
              + Add Product
            </button>
          </div>

          <div className="form-actions">
            <button type="button" className="reset-btn" onClick={resetForm}>
              Reset
            </button>
            <button type="submit" className="generate-btn">
              Generate
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
