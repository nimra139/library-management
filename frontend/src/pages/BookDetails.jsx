import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

export default function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      api.get(`/books/${id}`),
      api.get("/transactions", { params: { bookId: id } }),
    ])
      .then(([b, t]) => {
        setBook(b.data.data);
        setHistory(t.data.data);
      })
      .catch((err) => setError(err.response?.data?.message || "Book load nahi hui"));
  }, [id]);

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : "-");

  if (error) return <p className="error">{error}</p>;
  if (!book) return <p>Loading...</p>;

  return (
    <div>
      <div className="page-head">
        <h1>{book.title}</h1>
        <div>
          <Link className="btn primary" to={`/books/edit/${book._id}`}>Edit</Link>{" "}
          <Link className="btn primary" to="/books">Back</Link>
        </div>
      </div>

      <div className="details">
        <p><strong>Author:</strong> {book.author}</p>
        <p><strong>Category:</strong> {book.category}</p>
        <p><strong>ISBN:</strong> {book.isbn}</p>
        <p><strong>Publication Year:</strong> {book.publicationYear}</p>
        <p><strong>Total Quantity:</strong> {book.quantity}</p>
        <p><strong>Available:</strong> {book.availableQuantity}</p>
      </div>

      <h2>Issue History</h2>
      {history.length === 0 ? (
        <p>Is book ki abhi koi history nahi.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Member</th>
                <th>Issue Date</th>
                <th>Return Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((t) => (
                <tr key={t._id}>
                  <td>{t.memberId?.name || "(deleted member)"}</td>
                  <td>{formatDate(t.issueDate)}</td>
                  <td>{formatDate(t.returnDate)}</td>
                  <td>
                    <span className={`badge ${t.status === "Issued" ? "issued" : "returned"}`}>
                      {t.status}
                    </span>
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