import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../../api/api";
import NavbarwithBack from "../NavbarWithBack";
import "./InvoicePayments.css";

export default function InvoicePayments() {
  const location = useLocation();
  const { invoiceNumber } = location.state || {};
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    if (!invoiceNumber) {
      return;
    }

    const fetchPayments = async () => {
      try {
        const response = await api.post("/payments/my-invoice-payments", {
          invoiceNumber,
        });
        setPayments(response.data);
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };

    fetchPayments();
  }, [invoiceNumber]);

  return (
    <>
      <NavbarwithBack />
      <div className="invoice-payments-container">
        <h2>Payments for Invoice {invoiceNumber}</h2>

        <div className="payments-table-wrapper">
          <table className="payments-table">
            <thead>
              <tr>
                <th>Payment Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Method</th>
                <th>Transaction ID</th>
              </tr>
            </thead>
            <tbody>
              {payments.length > 0 ? (
                payments.map((payment) => (
                  <tr key={payment.paymentId}>
                    <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                    <td>{payment.amount}</td>
                    <td
                      className={
                        payment.status === "SUCCESS"
                          ? "success"
                          : payment.status === "FAILED"
                          ? "failed"
                          : "pending"
                      }
                    >
                      {payment.status}
                    </td>
                    <td>{payment.method}</td>
                    <td>{payment.transactionId || "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-payments">
                    No payments found for this invoice.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
