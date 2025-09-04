import React, { useState, useEffect } from "react";
import api from "../../api/api";
import "./CustomerProfile.css";

export default function CustomerProfile() {
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
      .get("/users/me")
      .then((res) =>
        setForm({
          fullName: res.data.fullName || "",
          emailId: res.data.emailId || "",
          phoneNumber: res.data.phoneNumber || "",
          username: res.data.username || "",
        })
      )
      .catch((err) => setError("Failed to load profile"))
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
      setError("Profile Name is required.");
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

    if (form.username.length < 3) {
      setError("Username must be at least 3 characters long.");
      return;
    }

    api
      .put("/users/me", {
        fullName: form.fullName,
        username: form.username,
      })
      .then(() => setSuccessMsg("Profile updated successfully."))
      .catch(() => setError("Update failed."));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="profile-form">
      <h2>Edit Profile</h2>
      {error && <div className="error">{error}</div>}
      {successMsg && <div className="success">{successMsg}</div>}
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
        <div className="form-buttons">
          <button
            className="reset-btn"
            type="button"
            onClick={() =>
              setForm((prev) => ({ ...prev, fullName: "", username: "" }))
            }
          >
            Reset
          </button>
          <button className="submit-btn" type="submit">
            Update
          </button>
        </div>
      </form>
    </div>
  );
}
