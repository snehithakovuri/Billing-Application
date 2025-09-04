import React, { useEffect, useState, useRef } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import "./PaymentsTracking.css";

export default function PaymentsTracking() {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const navigate = useNavigate();
  const filterRef = useRef(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await api.get("/payments");
      const mapped = res.data.map((pmt) => {
        let method = pmt.method;
        if (method === "CREDIT_CARD" || method === "DEBIT_CARD") {
          method = "CARD";
        }
        return {
          invoiceNumber: pmt.invoice?.invoiceNumber,
          customerEmail: pmt.invoice?.customer?.emailId,
          amount: pmt.amount,
          method,
          status: pmt.status,
          transactionId: pmt.transactionId,
          paymentDate: pmt.paymentDate,
        };
      });
      setPayments(mapped);
      setFilteredPayments(mapped);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const totalLast30Days = payments
    .filter(
      (p) =>
        p.status === "SUCCESS" &&
        new Date(p.paymentDate) >=
          new Date(new Date().setDate(new Date().getDate() - 30))
    )
    .reduce((sum, p) => sum + p.amount, 0);

  useEffect(() => {
    let data = [...payments];

    if (search) {
      data = data.filter((p) => {
        const invoiceNumber = p.invoiceNumber || "";
        const transactionId = p.transactionId || ""; 
        return (
          invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
          transactionId.toLowerCase().includes(search.toLowerCase())
        );
      });
    }

    if (statusFilter) {
      data = data.filter(
        (p) => p.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    if (methodFilter) {
      data = data.filter(
        (p) => p.method.toLowerCase() === methodFilter.toLowerCase()
      );
    }

    const normalizeDate = (date) => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return d;
    };

    if (dateFrom && dateTo) {
      data = data.filter(
        (p) =>
          normalizeDate(p.paymentDate) >= normalizeDate(dateFrom) &&
          normalizeDate(p.paymentDate) <= normalizeDate(dateTo)
      );
    } else if (dateFrom) {
      data = data.filter((p) => normalizeDate(p.paymentDate) >= normalizeDate(dateFrom));
    } else if (dateTo) {
      data = data.filter((p) => normalizeDate(p.paymentDate) <= normalizeDate(dateTo));
    }

    setFilteredPayments(data);
    setCurrentPage(1);
  }, [search, statusFilter, methodFilter, dateFrom, dateTo, payments]);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredPayments.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredPayments.length / recordsPerPage);

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;
  };

  return (
    <div className="payment-tracking-container">
      <h2>Payment Tracking</h2>

      <div className="summary-info">
        <strong>Payments received in last 30 days:</strong>{" "}
        <span>₹{totalLast30Days}</span>
      </div>

      <div className="top-actions">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by invoice # or transaction ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="search-btn" onClick={() => setSearch(search)}>
            🔍
          </button>
        </div>

        <div className="filter-container" ref={filterRef}>
          <button
            className="filter-btn"
            onClick={() => setShowFilters((prev) => !prev)}
          >
            Filter
          </button>
          {showFilters && (
            <div className="filter-options">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="SUCCESS">Success</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
              </select>

              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
              >
                <option value="">All Methods</option>
                <option value="CASH">Cash</option>
                <option value="CARD">Card</option>
                <option value="UPI">UPI</option>
                <option value="QR">QR</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
              </select>

              <label>
                From:
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </label>
              <label>
                To:
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </label>
            </div>
          )}
        </div>

        <button
          onClick={() => navigate("/record-payment")}
          className="add-payment-btn"
        >
          + Record New Payment
        </button>
      </div>

      <div className="table-wrapper">
        <table className="payment-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Customer Email</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Transaction ID</th>
              <th>Payment Date</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length > 0 ? (
              currentRecords.map((p, index) => (
                <tr key={p.transactionId || `fallback-key-${index}`}>
                  <td>{p.invoiceNumber}</td>
                  <td>{p.customerEmail}</td>
                  <td>{p.amount}</td>
                  <td>{p.method}</td>
                  <td
                    className={
                      p.status === "SUCCESS"
                        ? "success"
                        : p.status === "FAILED"
                        ? "failed"
                        : "pending"
                    }
                  >
                    {p.status}
                  </td>
                  <td>{p.transactionId}</td>
                  <td>{formatDate(p.paymentDate)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-payments">
                  No payments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={currentPage === index + 1 ? "active" : ""}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
