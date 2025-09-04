import React, { useEffect, useState, useRef } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import "./ProductService.css";

export default function ProductService() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [typeFilter, setTypeFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const navigate = useNavigate();
  const filterRef = useRef(null);

  const fetchItems = async () => {
    try {
      const res = await api.get("/products");
      const mapped = res.data.map((p) => ({
        id: p.productId,
        productName: p.productName,
        type: p.type,
        price: p.price,
      }));
      setItems(mapped);
      setFilteredItems(mapped);
    } catch (error) {
      console.error("Error fetching products/services:", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (productName) => {
    if (!window.confirm(`Are you sure you want to delete ${productName}?`)) return;
    try {
      await api.delete("/products", { data: { productName: productName } });
      alert("Deleted successfully!");
      fetchItems();
    } catch (error) {
      console.error("Error deleting:", error);
      alert(error.response?.data?.message || "Failed to delete item.");
    }
  };

  useEffect(() => {
    let data = [...items];
    if (search) {
      data = data.filter(
        (i) =>
          i.productName.toLowerCase().includes(search.toLowerCase()) ||
          i.type.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (typeFilter) {
      data = data.filter((i) => i.type.toLowerCase() === typeFilter.toLowerCase());
    }
    setFilteredItems(data);
    setCurrentPage(1);
  }, [search, typeFilter, items]);

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
  const currentRecords = filteredItems.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredItems.length / recordsPerPage);

  return (
    <div className="product-service-container">
      <h2>Products / Services</h2>

      <div className="top-actions">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by name or type"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="search-btn" onClick={() => setSearch(search)}>🔍</button>
        </div>

        <div className="filter-container" ref={filterRef}>
          <button className="filter-btn" onClick={() => setShowFilters((prev) => !prev)}>
            Filter
          </button>
          {showFilters && (
            <div className="filter-options">
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                <option value="">All Types</option>
                <option value="PRODUCT">Product</option>
                <option value="SERVICE">Service</option>
              </select>
            </div>
          )}
        </div>

        <button
          onClick={() => navigate("/add-productservice")}
          className="add-product-service-btn"
        >
          + Add Product / Service
        </button>
      </div>

      <div className="table-wrapper">
        <table className="item-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Price / Unit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length > 0 ? (
              currentRecords.map((i) => (
                <tr key={i.id}>
                  <td>{i.productName}</td>
                  <td>{i.type}</td>
                  <td>{i.price}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() =>
                        navigate(`/edit-productservice/${i.productName}`, { state: { product: i } })
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(i.productName)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-data">No products/services found</td>
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
