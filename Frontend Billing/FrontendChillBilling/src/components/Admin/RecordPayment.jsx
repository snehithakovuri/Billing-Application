import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import "./RecordPayment.css";
import NavbarwithBack from "../NavbarWithBack";

export default function RecordPayment() {
  const [invoiceOptions, setInvoiceOptions] = useState([]);
  const [form, setForm] = useState({
    invoiceNumber: "",
    amount: "",
    method: "",
    status: "",
    transactionId: "",
    paymentDate: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await api.get("/invoices");

      const options = res.data
        .filter((inv) => inv.invoiceNumber && inv.customer)
        .map((inv) => ({
          invoiceNumber: inv.invoiceNumber,
          customerEmail: inv.customer.emailId,
        }));

      setInvoiceOptions(options);
    } catch (err) {
      console.error("Error fetching invoices:", err);
      alert("Failed to load invoices.");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      invoiceNumber,
      amount,
      method,
      status,
      transactionId,
      paymentDate,
    } = form;

    if (
      !invoiceNumber ||
      !amount ||
      !method ||
      !status ||
      !paymentDate
    ) {
      alert("Please fill required fields.");
      return;
    }

    const formattedPaymentDate = new Date(paymentDate).toISOString();

    const payload = {
      invoiceNumber,
      amount,
      method,
      status,
      transactionId,
      paymentDate: formattedPaymentDate,
    };

    try {
      await api.post("/payments", payload);
      alert("Payment recorded successfully!");
      navigate(-1);
    } catch (err) {
      console.error("Error recording payment:", err);
      alert("Failed to record payment.");
    }
  };

  const handleReset = () => {
    setForm({
      invoiceNumber: "",
      amount: "",
      method: "",
      status: "",
      transactionId: "",
      paymentDate: "",
    });
  };

  return (
    <>
      <NavbarwithBack />
      <div className="record-payment-container">
        <h2>Record New Payment</h2>
        <form onSubmit={handleSubmit}>
          <label>Invoice Number</label>
          <select
            name="invoiceNumber"
            value={form.invoiceNumber}
            onChange={handleChange}
            required
          >
            <option value="">Select Invoice</option>
            {invoiceOptions.length > 0 ? (
              invoiceOptions.map((inv) => (
                <option key={inv.invoiceNumber} value={inv.invoiceNumber}>
                  {inv.invoiceNumber} ({inv.customerEmail})
                </option>
              ))
            ) : (
              <option disabled>Loading invoices...</option>
            )}
          </select>

          <label>Amount</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            required
          />

          <label>Payment Date</label>
          <input
            type="date"
            name="paymentDate"
            value={form.paymentDate}
            onChange={handleChange}
            required
          />

          <label>Payment Method</label>
          <select
            name="method"
            value={form.method}
            onChange={handleChange}
            required
          >
            <option value="">Select Method</option>
            <option value="CASH">Cash</option>
            <option value="CREDIT_CARD">Credit Card</option>
            <option value="DEBIT_CARD">Debit Card</option>
            <option value="UPI">UPI</option>
            <option value="QR">QR</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
          </select>

          <label>Transaction ID</label>
          <input
            type="text"
            name="transactionId"
            value={form.transactionId}
            onChange={handleChange}
          />

          <label>Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            required
          >
            <option value="">Select Status</option>
            <option value="SUCCESS">Success</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
          </select>

          <div className="form-buttons">
            <button type="button" onClick={handleReset} className="reset-btn">
              Reset
            </button>
            <button type="submit" className="record-btn">
              Record
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
