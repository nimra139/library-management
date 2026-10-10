import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AddMember() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.post("/members", form);
      navigate("/members", { state: { message: "Member added successfully" } });
    } catch (err) {
      setError(err.response?.data?.message || "Member add nahi ho saka");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1>Add Member</h1>
      {error && <p className="error">{error}</p>}

      <form className="form" onSubmit={handleSubmit}>
        <label>Name</label>
        <input name="name" value={form.name} onChange={handleChange} required />

        <label>Email</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} required />

        <label>Phone</label>
        <input name="phone" value={form.phone} onChange={handleChange} required />

        <label>Address</label>
        <input name="address" value={form.address} onChange={handleChange} required />

        <button className="btn primary" type="submit" disabled={saving}>
          {saving ? "Saving..." : "Add Member"}
        </button>
      </form>
    </div>
  );
}