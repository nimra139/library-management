import { useEffect, useState } from "react";
import api from "../services/api";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadTransactions = () => {
    setLoading(true);
    api
      .get("/transactions", { params: { status } })
      .then((res) => {
        setTransactions(res.data.data);
        setError("");
      })
      .catch(() => setError("Transactions load nahi ho sakin"))
      .finally(() => setLoading(false));
  };

  // Status filter badle to backend se dobara mangwao
  useEffect(() => {
    loadTransactions();
  }, [status]);

  const handleReturn = async (id, title) => {
    if (!window.confirm(`"${title}" return karna chahte hain?`)) return;
    try {
      const res = await api.put(`/transactions/${id}/return`);
      setMessage(res.data.message);
      setError("");
      loadTransactions();
    } catch (err) {
      setError(err.response?.data?.message || "Return nahi ho saka");
      setMessage("");
    }
  };

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : "-");

  return (
    <div>
      <h1>Issued / Returned Books</h1>

      <div className="toolbar">
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Sab</option>
          <option value="Issued">Issued</option>
          <option value="Returned">Returned</option>
        </select>
      </div>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : transactions.length === 0 ? (
        <p>Koi record nahi mila.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Book</th>
                <th>Member</th>
                <th>Issue Date</th>
                <th>Return Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t._id}>
                  <td>{t.bookId?.title || "(deleted book)"}</td>
                  <td>{t.memberId?.name || "(deleted member)"}</td>
                  <td>{formatDate(t.issueDate)}</td>
                  <td>{formatDate(t.returnDate)}</td>
                  <td>
                    <span className={`badge ${t.status === "Issued" ? "issued" : "returned"}`}>
                      {t.status}
                    </span>
                  </td>
                  <td>
                    {t.status === "Issued" ? (
                      <button
                        className="btn primary"
                        onClick={() => handleReturn(t._id, t.bookId?.title)}
                      >
                        Return
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}