import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AddBook() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "",
    isbn: "",
    quantity: "",
    publicationYear: "",
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
      await api.post("/books", form);
      navigate("/books", { state: { message: "Book added successfully" } });
    } catch (err) {
      setError(err.response?.data?.message || "Book add nahi ho saki");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1>Add Book</h1>
      {error && <p className="error">{error}</p>}

      <form className="form" onSubmit={handleSubmit}>
        <label>Title</label>
        <input name="title" value={form.title} onChange={handleChange} required />

        <label>Author</label>
        <input name="author" value={form.author} onChange={handleChange} required />

        <label>Category</label>
        <input name="category" value={form.category} onChange={handleChange} required />

        <label>ISBN</label>
        <input name="isbn" value={form.isbn} onChange={handleChange} required />

        <label>Quantity</label>
        <input type="number" min="0" name="quantity" value={form.quantity} onChange={handleChange} required />

        <label>Publication Year</label>
        <input type="number" name="publicationYear" value={form.publicationYear} onChange={handleChange} required />

        <button className="btn primary" type="submit" disabled={saving}>
          {saving ? "Saving..." : "Add Book"}
        </button>
      </form>
    </div>
  );
}