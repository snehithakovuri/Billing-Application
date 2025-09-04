import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import "./PaymentsHistory.css";

export default function PaymentsHistory() {
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

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await api.get("/payments/my");
      const mapped = res.data.map((pmt) => ({
        paymentId: pmt.paymentId,
        invoiceNumber: pmt.invoice.invoiceNumber,
        paymentDate: pmt.paymentDate,
        method: pmt.method,
        amount: pmt.amount,
        status: pmt.status,
        transactionId: pmt.transactionId,
      }));
      setPayments(mapped);
      setFilteredPayments(mapped);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  useEffect(() => {
    let data = [...payments];

    if (search) {
      data = data.filter(
        (p) =>
          p.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
          p.transactionId?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter) {
      data = data.filter(
        (p) => p.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    if (methodFilter) {
      if (methodFilter === "CARD") {
        data = data.filter(
          (p) =>
            p.method.toLowerCase() === "credit_card" ||
            p.method.toLowerCase() === "debit_card"
        );
      } else {
        data = data.filter(
          (p) => p.method.toLowerCase() === methodFilter.toLowerCase()
        );
      }
    }

    if (dateFrom) {
      data = data.filter((p) => new Date(p.paymentDate) >= new Date(dateFrom));
    }

    if (dateTo) {
      data = data.filter((p) => new Date(p.paymentDate) <= new Date(dateTo));
    }

    setFilteredPayments(data);
    setCurrentPage(1);
  }, [search, statusFilter, methodFilter, dateFrom, dateTo, payments]);

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredPayments.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredPayments.length / recordsPerPage);

  return (
    <div className="payment-history-container">
      <h2>Payments History</h2>

      <div className="top-actions">
        <div className="filter-container">
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
      </div>

      <div className="table-wrapper">
        <table className="payment-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Invoice #</th>
              <th>Payment Date</th>
              <th>Payment Method</th>
              <th>Amount</th>
              <th>Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length > 0 ? (
              currentRecords.map((p) => (
                <tr key={p.paymentId}>
                  <td>{p.transactionId || "N/A"}</td>
                  <td>{p.invoiceNumber}</td>
                  <td>{new Date(p.paymentDate).toLocaleString()}</td>
                  <td>
                    {p.method === "CREDIT_CARD" || p.method === "DEBIT_CARD"
                      ? "CARD"
                      : p.method === "BANK_TRANSFER"
                      ? "BANK TRANSFER"
                      : p.method}
                  </td>
                  <td>{p.amount}</td>
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
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-payments">
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
