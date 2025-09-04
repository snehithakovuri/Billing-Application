import React, { useEffect, useState, useRef } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import "./UserManagement.css";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const navigate = useNavigate();
  const filterRef = useRef(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      const mappedUsers = res.data.map((u) => ({
        id: u.userId,
        name: u.fullName,
        email: u.emailId,
        username: u.username,
        phone: u.phoneNumber,
        role: u.role,
        status: u.status,
      }));
      setUsers(mappedUsers);
      setFilteredUsers(mappedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      if (error.response?.status === 403) {
        alert("Access denied. Only Admin can access this page.");
        navigate("/admindashboard");
      }
    }
  };

  const handleDelete = async (email) => {
    if (!window.confirm(`Are you sure you want to delete ${email}?`)) return;

    try {
      await api.delete("/users", {
        data: { email },
      });
      alert("User deleted successfully!");
      fetchUsers(); 
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user.");
    }
  };

  useEffect(() => {
    let data = [...users];
    if (search) {
      data = data.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (roleFilter) {
      data = data.filter(
        (u) => u.role.toLowerCase() === roleFilter.toLowerCase()
      );
    }
    if (statusFilter) {
      data = data.filter(
        (u) => u.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    setFilteredUsers(data);
    setCurrentPage(1);
  }, [search, roleFilter, statusFilter, users]);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredUsers.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredUsers.length / recordsPerPage);

  return (
    <div className="user-management-container">
      <h2>User Management</h2>
      {" "}
      <div className="top-actions">
        {" "}
        {" "}
        <div className="search-bar">
          {" "}
          <input
            type="text"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSearch(e.target.value);
              }
            }}
          />{" "}
          <button className="search-btn" onClick={() => setSearch(search)}>
            {" "}
            🔍{" "}
          </button>{" "}
        </div>{" "}
        {" "}
        <div className="filter-container" ref={filterRef}>
          {" "}
          <button
            className="filter-btn"
            onClick={() => setShowFilters((prev) => !prev)}
          >
            {" "}
            Filter{" "}
          </button>{" "}
          {showFilters && (
            <div className="filter-options">
              {" "}
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                {" "}
                <option value="">All Roles</option>{" "}
                <option value="ADMIN">Admin</option>{" "}
                <option value="ACCOUNTANT">Accountant</option>{" "}
                <option value="CUSTOMER">Customer</option>{" "}
              </select>{" "}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {" "}
                <option value="">All Status</option>{" "}
                <option value="Active">Active</option>{" "}
                <option value="InActive">Inactive</option>{" "}
              </select>{" "}
            </div>
          )}{" "}
        </div>{" "}
        {" "}
        <button onClick={() => navigate("/add-user")} className="add-user-btn">
          {" "}
          + Add User{" "}
        </button>{" "}
      </div>
     
      <div className="table-wrapper">
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length > 0 ? (
              currentRecords.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td
                    className={user.status === "ACTIVE" ? "active" : "inactive"}
                  >
                    {user.status}
                  </td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() =>
                        navigate(`/edit-user/${user.email}`, {
                          state: { user },
                        })
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(user.email)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-users">
                  No users
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
