import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import "./CustomerInvoices.css";

export default function CustomerInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dueDateFrom, setDueDateFrom] = useState("");
  const [dueDateTo, setDueDateTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const navigate = useNavigate();

  useEffect(() => {
    fetchMyInvoices();
  }, []);

  const fetchMyInvoices = async () => {
    try {
      const res = await api.get("/invoices/my");
      const mapped = res.data.map((inv) => ({
        invoiceNumber: inv.invoiceNumber,
        dueDate: inv.dueDate,
        invoiceDate:inv.invoiceDate,
        balance: inv.balance,
        totalAmount: inv.totalAmount,
        status: inv.status,
      }));
      setInvoices(mapped);
      setFilteredInvoices(mapped);
    } catch (error) {
      console.error("Error fetching your invoices:", error);
      if (error.response?.status === 401) {
        alert("Unauthorized. Please log in again.");
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    let data = [...invoices];

    if (search) {
      data = data.filter((inv) =>
        inv.invoiceNumber.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter) {
      data = data.filter(
        (inv) => inv.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    if (dueDateFrom) {
      data = data.filter(
        (inv) => new Date(inv.dueDate) >= new Date(dueDateFrom)
      );
    }

    if (dueDateTo) {
      data = data.filter((inv) => new Date(inv.dueDate) <= new Date(dueDateTo));
    }

    setFilteredInvoices(data);
    setCurrentPage(1);
  }, [search, statusFilter, dueDateFrom, dueDateTo, invoices]);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredInvoices.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredInvoices.length / recordsPerPage);

  // Function to handle "Payments" button click
  const handlePaymentsClick = (invoiceNumber) => {
    // Navigate to InvoicePayments page with invoiceNumber as a state
    navigate(`/invoice-payments/${invoiceNumber}`, { state: { invoiceNumber } });
  };

  return (
    <div className="customer-invoices-container">
      <h2>My Invoices</h2>

      {/* Top Actions */}
      <div className="customer-invoices-top-actions">
        {/* Filter Dropdown */}
        <div className="filter-container">
          <button
            className="customer-filter-btn"
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
                <option value="PAID">Paid</option>
                <option value="UNPAID">Unpaid</option>
                <option value="PARTIALLY_PAID">Partially Paid</option>
              </select>

              <label>
                From:
                <input
                  type="date"
                  value={dueDateFrom}
                  onChange={(e) => setDueDateFrom(e.target.value)}
                />
              </label>
              <label>
                To:
                <input
                  type="date"
                  value={dueDateTo}
                  onChange={(e) => setDueDateTo(e.target.value)}
                />
              </label>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by invoice #"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSearch(e.target.value);
              }
            }}
          />
          <button className="search-btn" onClick={() => setSearch(search)}>
            🔍
          </button>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="customer-invoices-table-wrapper">
        <table className="customer-invoices-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Due Date</th>
              <th>Issued Date</th>
              <th>Balance</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length > 0 ? (
              currentRecords.map((inv) => (
                <tr key={inv.invoiceNumber}>
                  <td>{inv.invoiceNumber}</td>
                  <td><big>{inv.dueDate}</big></td>
                  <td>{inv.invoiceDate}</td>
                  <td>{inv.balance}</td>
                  <td>{inv.totalAmount}</td>
                  <td
                    className={
                      inv.status === "PAID"
                        ? "paid"
                        : inv.status === "UNPAID"
                        ? "unpaid"
                        : inv.status === "OVERDUE"
                        ? "overdue"
                        : "partial"
                    }
                  >
                    {inv.status}
                  </td>
                  <td>
                    <button
                      className="view-btn"
                      onClick={() =>
                        navigate(`/invoice/${inv.invoiceNumber}`, {
                          state: { invoiceNumber: inv.invoiceNumber, backTo : "/customerinvoices" },
                        })
                      }
                    >
                      open
                    </button>
                    <button
                      className="payments-btn"
                      onClick={() => handlePaymentsClick(inv.invoiceNumber)}
                    >
                      Payments
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="customer-no-invoices">
                  No invoices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="customer-pagination">
        <span className="page-text">Page</span>
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
