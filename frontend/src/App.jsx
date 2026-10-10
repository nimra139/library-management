import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import AddBook from "./pages/AddBook";
import Members from "./pages/Members";
import AddMember from "./pages/AddMember";
import EditBook from "./pages/EditBook";
import EditMember from "./pages/EditMember";
import IssueBook from "./pages/IssueBook";
import Transactions from "./pages/Transactions";
import BookDetails from "./pages/BookDetails";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/add" element={<AddBook />} />
          <Route path="/members" element={<Members />} />
        <Route path="/members/add" element={<AddMember />} />
        <Route path="/books/edit/:id" element={<EditBook />} />
        <Route path="/members/edit/:id" element={<EditMember />} />
        <Route path="/issue" element={<IssueBook />} />
<Route path="/transactions" element={<Transactions />} />
<Route path="/books/:id" element={<BookDetails />} />

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;