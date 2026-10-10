import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

export default function EditMember() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Purana data backend se lao
  useEffect(() => {
    api
      .get(`/members/${id}`)
      .then((res) => {
        const m = res.data.data;
        setForm({
          name: m.name,
          email: m.email,
          phone: m.phone,
          address: m.address,
        });
      })
      .catch((err) => setError(err.response?.data?.message || "Member load nahi hua"));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.put(`/members/${id}`, form);
      navigate("/members", { state: { message: "Member updated successfully" } });
    } catch (err) {
      setError(err.response?.data?.message || "Update nahi ho saka");
    } finally {
      setSaving(false);
    }
  };

  if (!form && !error) return <p>Loading...</p>;
  if (!form) return <p className="error">{error}</p>;

  return (
    <div>
      <h1>Edit Member</h1>
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
          {saving ? "Saving..." : "Update Member"}
        </button>
      </form>
    </div>
  );
}