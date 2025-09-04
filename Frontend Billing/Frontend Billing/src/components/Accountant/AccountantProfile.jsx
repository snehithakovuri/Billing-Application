import React, { useState, useEffect } from "react";
import api from "../../api/api";
import "./AccountantProfile.css";

export default function AccountantProfile() {
  const [form, setForm] = useState({
    fullName: "",
    emailId: "",
    phoneNumber: "",
    username: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    api
      .get("/users/my-profile")
      .then((res) =>
        setForm({
          fullName: res.data.fullName || "",
          emailId: res.data.emailId || "",
          phoneNumber: res.data.phoneNumber || "",
          username: res.data.username || "",
        })
      )
      .catch(() => setError("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!form.fullName.trim()) {
      setError("Full Name is required.");
      return;
    }

    if (!form.username.trim() || form.username.length < 6) {
    alert("A minimum 6 characters username is required.");
      return;
    }

    const usernameRegex = /^[a-zA-Z0-9._]+$/;
    if (!usernameRegex.test(form.username)) {
      setError(
        "Username can only contain letters, numbers, dots (.) and underscores (_), and no spaces."
      );
      return;
    }

    api
      .put("/users", {
        fullName: form.fullName,
        emailId: form.emailId,
        phoneNumber: form.phoneNumber,
        username: form.username,
      })
      .then(() => setSuccessMsg("Profile updated successfully."))
      .catch(() => setError("Update failed."));
  };

  if (loading) return <div>No data found.</div>;

  return (
    <div className="accountant-profile-form">
      <h2>Edit Profile</h2>
      {error && <div className="accountant-error">{error}</div>}
      {successMsg && <div className="accountant-success">{successMsg}</div>}
      <form onSubmit={handleSubmit}>
        <label>
          Full Name:
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
          />
        </label>
        <label>
          Email ID:
          <input name="emailId" value={form.emailId} disabled />
        </label>
        <label>
          Phone Number:
          <input name="phoneNumber" value={form.phoneNumber} disabled />
        </label>
        <label>
          Username:
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
          />
        </label>
        <div className="accountant-form-buttons">
          <button
            className="accountant-reset-btn"
            type="button"
            onClick={() =>
              setForm((prev) => ({
                ...prev,
                fullName: "",
                username: "",
              }))
            }
          >
            Reset
          </button>
          <button className="accountant-submit-btn" type="submit">
            Update
          </button>
        </div>
      </form>
    </div>
  );
}
