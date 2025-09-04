import React, { useEffect, useState, useRef } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import "./CustomerManagement.css";

export default function CustomerManagement() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const navigate = useNavigate();
  const filterRef = useRef(null);

  const fetchCustomers = async () => {
    try {
      const res = await api.get("/users/customers");
      const mappedCustomers = res.data.map((c) => ({
        id: c.userId,
        name: c.fullName,
        email: c.emailId,
        username: c.username, 
        phone: c.phoneNumber,
        status: c.status,
      }));
      setCustomers(mappedCustomers);
      setFilteredCustomers(mappedCustomers);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async (email) => {
    if (!window.confirm(`Are you sure you want to delete ${email}?`)) return;
    try {
      await api.delete("/users/customers", { data: { email } });
      alert("Customer deleted successfully!");
      fetchCustomers();
    } catch (error) {
      console.error("Error deleting customer:", error);
      alert(
        error.response?.data?.message ||
          "Failed to delete customer. Something went wrong."
      );
    }
  };

  useEffect(() => {
    let data = [...customers];
    if (search) {
      data = data.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (statusFilter) {
      data = data.filter(
        (c) => c.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    setFilteredCustomers(data);
    setCurrentPage(1);
  }, [search, statusFilter, customers]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredCustomers.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredCustomers.length / recordsPerPage);

  return (
    <div className="customer-management-container">
      <h2>Customer Management</h2>

      <div className="top-actions">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by name or email"
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
                <option value="Active">Active</option>
                <option value="InActive">Inactive</option>
              </select>
            </div>
          )}
        </div>

        <button
          onClick={() => navigate("/addcustomer")}
          className="add-customer-btn"
        >
          + Add Customer
        </button>
      </div>

      <div className="table-wrapper">
        <table className="customer-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone No</th>
              <th>Email</th>
              <th>Status</th>
              <th>Action</th> {/* added */}
            </tr>
          </thead>
          <tbody>
            {currentRecords.length > 0 ? (
              currentRecords.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.phone}</td>
                  <td>{c.email}</td>
                  <td
                    className={
                      c.status === "ACTIVE" ? "status-active" : "status-inactive"
                    }
                  >
                    {c.status}
                  </td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() =>
                        navigate(`/editcustomer/${c.email}`, {
                          state: { customer: c },
                        })
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(c.email)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">
                  No customers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <span className="page-text">Page</span>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? "active" : ""}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
