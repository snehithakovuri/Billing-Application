import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api/api";
import logoChill from "../../assets/Billing.png";
import "./Invoice.css";

export default function Invoice() {
  const { state } = useLocation();

  const navigate = useNavigate();


  const { invoiceNumber, backTo } = state || {};
  const [invoice, setInvoice] = useState(null);
  const [payAmount, setPayAmount] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (invoiceNumber) {
      fetchInvoiceDetails(invoiceNumber);
    }
  }, [invoiceNumber]);

  const fetchInvoiceDetails = async (invoiceNumber) => {
    try {
      const res = await api.post("/invoices/by-invoice-number", { invoiceNumber });
      setInvoice(res.data);
    } catch (error) {
      console.error("Error fetching invoice details:", error);
    }
  };

  const handlePayment = async () => {
    if (!invoice) return;

    let amount = parseFloat(payAmount);

    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    if (amount > invoice.balance) {
      alert("Amount cannot be greater than balance due.");
      return;
    }

    try {
      const res = await api.post("/payments/create-order", {
        amount: amount,
        invoiceNumber: invoice.invoiceNumber,
      });

      const { orderId, amount: orderAmount, currency, key } = res.data;

      const options = {
        key: key,
        amount: orderAmount,
        currency: currency,
        name: "Chill Billing",
        description: `Payment for Invoice #${invoice.invoiceNumber}`,
        order_id: orderId,
        handler: function (response) {
          alert("Payment initiated. Payment ID: " + response.razorpay_payment_id);
          fetchInvoiceDetails(invoice.invoiceNumber);
        },
        prefill: {
          name: invoice.customer.fullName,
          email: invoice.customer.emailId,
          contact: invoice.customer.phoneNumber,
        },
        theme: {
          color: "#ebe5e5",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      setShowModal(false);
      setPayAmount("");
    } catch (err) {
      console.error("Payment error:", err);
      alert("Unable to initiate payment");
    }
  };

  if (!invoice) return <div>Not found</div>;

  const getStatusColor = (status) => {
    switch (status) {
      case "PAID": return "green";
      case "PARTIALLY_PAID": return "yellow";
      case "UNPAID": return "orange";
      case "OVERDUE": return "red";
      default: return "gray";
    }
  };

  return (
    <>
          <div className="invoice-navbar">
      <div className="invoice-navbar-left">
        <img src={logoChill} alt="Logo" className="invoice-logo" />
      </div>
      <div className="invoice-navbar-right">
        {backTo && (
          <button className="invoice-back-btn" onClick={() => navigate(backTo)}>
            Back
          </button>
        )}
      </div>
    </div>
      <div className="invoice-container">
        <h2><small>Invoice Number:</small> {invoice.invoiceNumber}</h2>

        <div className="invoice-info">
          <div className="invoice-dates">
            <div>Issued Date: {invoice.invoiceDate}</div> <span>|</span>
            <div>Due Date: <strong>{invoice.dueDate}</strong></div>
          </div>
          <div className="status">
            <span className="status-circle" style={{ backgroundColor: getStatusColor(invoice.status) }}></span>
            <span>{invoice.status}</span>
          </div>
        </div>

        <div className="customer-details">
          <h3>Billed to:</h3>
          <div className="customer-info">
            <p>{invoice.customer.fullName}</p>
            <p>{invoice.customer.emailId}</p>
            <p>{invoice.customer.phoneNumber}</p>
          </div>
        </div>

        <div className="products-table">
          <table>
            <thead>
              <tr>
                <th>Product / Service</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr key={item.itemId}>
                  <td>{item.product.productName}</td>
                  <td>{item.quantity}</td>
                  <td>{item.unitPrice}</td>
                  <td>{item.totalPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="grand-total">
            <p><small>Grand Total: </small>₹{invoice.totalAmount}</p>
          </div>
        </div>

        <div className="payment-details">
          <p>Paid Amount: ₹{invoice.paidAmount}</p>
          <p>Balance Due: <strong>₹{invoice.balance}</strong></p>
        </div>

        <div className="action-buttons">
          {invoice.balance > 0 && (
            <button
              className="pay-now-btn"
              onClick={() => setShowModal(true)}
            >
              Pay Now
            </button>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Enter Payment Amount</h3>
            <input
              type="number"
              value={payAmount}
              onChange={(e) => setPayAmount(e.target.value)}
              placeholder={`Max ₹${invoice.balance}`}
              className="modal-input"
            />
            <div className="modal-actions">
              <button
                onClick={() => setShowModal(false)}
                className="modal-btn cancel-btn"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                className="modal-btn proceed-btn"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
