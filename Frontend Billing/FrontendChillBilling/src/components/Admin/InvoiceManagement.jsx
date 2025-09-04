import React, { useEffect, useState, useRef } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import "./InvoiceManagement.css";

export default function InvoiceManagement() {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [dueDateFrom, setDueDateFrom] = useState("");
  const [dueDateTo, setDueDateTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const navigate = useNavigate();
  const filterRef = useRef(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await api.get("/invoices");
      const mapped = res.data.map((inv) => ({
        invoiceNumber: inv.invoiceNumber,
        customerName: inv.customer?.fullName || "N/A",
        email: inv.customer?.emailId || "",
        dueDate: inv.dueDate,
        balance: inv.balance,
        totalAmount: inv.totalAmount,
        status: inv.status,
      }));

      setInvoices(mapped);
      setFilteredInvoices(mapped);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      if (error.response?.status === 403) {
        alert("Access denied. Only Admin can access this page.");
        navigate("/");
      }
    }
  };

  const handleDelete = async (invoiceNumber) => {
    if (!window.confirm(`Are you sure you want to delete ${invoiceNumber}?`))
      return;

    try {
      await api.delete("/invoices", {
        data: { invoiceNumber },
      });
      alert("Invoice deleted successfully!");
      fetchInvoices();
    } catch (error) {
      console.error("Error deleting invoice:", error);
      alert("Failed to delete invoice.");
    }
  };

  const handleNotify = async (email, invoiceNumber) => {
    try {
      await api.post("/auth/notify", {
        email,
        invoiceNumber,
      });
      alert(`Notification sent to ${email} for invoice ${invoiceNumber}`);
    } catch (error) {
      console.error("Error sending notification:", error);
      alert("Failed to send notification");
    }
  };

  useEffect(() => {
    let data = [...invoices];

    if (search) {
      data = data.filter(
        (inv) =>
          inv.customerName.toLowerCase().includes(search.toLowerCase()) ||
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

  return (
    <div className="invoice-management-container">
      <h2>Invoice Management</h2>
      <div className="top-actions">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by customer or invoice #"
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
                <option value="PAID">Paid</option>
                <option value="UNPAID">Unpaid</option>
                <option value="PARTIALLY_PAID">Partially Paid</option>
                <option value="OVERDUE">Overdue</option>
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

        <button
          onClick={() => navigate("/add-invoice")}
          className="add-invoice-btn"
        >
          + Add Invoice
        </button>
      </div>

      <div className="table-wrapper">
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Customer</th>
              <th>Due Date</th>
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
                  <td>{inv.customerName}</td>
                  <td>{inv.dueDate}</td>
                  <td>{inv.balance}</td>
                  <td>{inv.totalAmount}</td>
                  <td
                    className={
                      inv.status === "PAID"
                        ? "paid"
                        : inv.status === "UNPAID"
                        ? "unpaid"
                        : inv.status === "PARTIALLY_PAID"
                        ? "partial"
                        : "overdue"
                    }
                  >
                    {inv.status}
                  </td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() =>
                        navigate(`/edit-invoice/${inv.invoiceNumber}`, {
                          state: { invoice: inv },
                        })
                      }
                      disabled={inv.status === "PAID"}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(inv.invoiceNumber)}
                    >
                      Delete
                    </button>
                    {inv.status !== "PAID" && (
                      <button
                        className="notify-btn"
                        onClick={() =>
                          handleNotify(inv.email, inv.invoiceNumber)
                        }
                      >
                        Notify
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-invoices">
                  No invoices
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
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
