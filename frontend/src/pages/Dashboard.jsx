import { useEffect, useState } from "react";
import api from "../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/dashboard")
      .then((res) => setStats(res.data.data))
      .catch(() => setError("Backend se connect nahi ho saka"));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!stats) return <p>Loading...</p>;

  const cards = [
    { label: "Total Books", value: stats.totalBooks },
    { label: "Total Members", value: stats.totalMembers },
    { label: "Issued Books", value: stats.issuedBooks },
    { label: "Returned Books", value: stats.returnedBooks },
    { label: "Available Books", value: stats.availableBooks },
  ];

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="cards">
        {cards.map((c) => (
          <div className="card" key={c.label}>
            <h3>{c.value}</h3>
            <p>{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}