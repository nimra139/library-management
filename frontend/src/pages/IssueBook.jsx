import { useEffect, useState } from "react";
import api from "../services/api";

export default function IssueBook() {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [bookId, setBookId] = useState("");
  const [memberId, setMemberId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadData = () => {
    return Promise.all([api.get("/books"), api.get("/members")])
      .then(([b, m]) => {
        setBooks(b.data.data);
        setMembers(m.data.data);
      })
      .catch(() => setError("Data load nahi ho saka"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const res = await api.post("/transactions/issue", { bookId, memberId });
      setMessage(res.data.message);
      setBookId("");
      setMemberId("");
      await loadData(); // availableQuantity dobara update ho
    } catch (err) {
      setError(err.response?.data?.message || "Book issue nahi ho saki");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Issue Book</h1>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}

      <form className="form" onSubmit={handleSubmit}>
        <label>Book</label>
        <select value={bookId} onChange={(e) => setBookId(e.target.value)} required>
          <option value="">-- Book chunein --</option>
          {books.map((b) => (
            <option key={b._id} value={b._id} disabled={b.availableQuantity === 0}>
              {b.title} (Available: {b.availableQuantity})
            </option>
          ))}
        </select>

        <label>Member</label>
        <select value={memberId} onChange={(e) => setMemberId(e.target.value)} required>
          <option value="">-- Member chunein --</option>
          {members.map((m) => (
            <option key={m._id} value={m._id}>
              {m.name} ({m.email})
            </option>
          ))}
        </select>

        <button className="btn primary" type="submit" disabled={saving}>
          {saving ? "Issuing..." : "Issue Book"}
        </button>
      </form>
    </div>
  );
}