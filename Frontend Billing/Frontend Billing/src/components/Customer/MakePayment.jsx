import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import "./MakePayment.css"; 

export default function MakePayment() {
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
        balance: inv.balance,
        totalAmount: inv.totalAmount,
        status: inv.status,
      }));
      const unpaidInvoices = mapped.filter((inv) => inv.status !== "PAID");
      setInvoices(unpaidInvoices);
      setFilteredInvoices(unpaidInvoices);
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

  return (
    <div className="make-payment-container">
      <h2>Make a Payment</h2>

      <div className="make-payment-top-actions">
        <div className="filter-container">
          <button
            className="make-payment-filter-btn"
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

      <div className="make-payment-table-wrapper">
        <table className="make-payment-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Due Date</th>
              <th>Balance</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length > 0 ? (
              currentRecords.map((inv) => (
                <tr key={inv.invoiceNumber}>
                  <td>{inv.invoiceNumber}</td>
                  <td>{inv.dueDate}</td>
                  <td>{inv.balance}</td>
                  <td>{inv.totalAmount}</td>
                  <td
                    className={
                      inv.status === "PARTIALLY_PAID"
                        ? "partial"
                        : inv.status === "UNPAID"
                        ? "unpaid"
                        : inv.status === "OVERDUE"
                        ? "overdue"
                        : ""
                    }
                  >
                    {inv.status}
                  </td>
                  <td>
                    <button
                      className="pay-btn"
                      onClick={() =>
                        navigate(`/invoice/${inv.invoiceNumber}`, {
                          state: { invoiceNumber: inv.invoiceNumber, backTo : "/makepayment" },
                        })
                      }
                    >
                      Pay
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="make-payment-no-invoices">
                  No unpaid invoices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="make-payment-pagination">
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
