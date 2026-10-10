import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

export default function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Purana data backend se lao
  useEffect(() => {
    api
      .get(`/books/${id}`)
      .then((res) => {
        const b = res.data.data;
        setForm({
          title: b.title,
          author: b.author,
          category: b.category,
          isbn: b.isbn,
          quantity: b.quantity,
          publicationYear: b.publicationYear,
        });
      })
      .catch((err) => setError(err.response?.data?.message || "Book load nahi hui"));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.put(`/books/${id}`, form);
      navigate("/books", { state: { message: "Book updated successfully" } });
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
      <h1>Edit Book</h1>
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
          {saving ? "Saving..." : "Update Book"}
        </button>
      </form>
    </div>
  );
}