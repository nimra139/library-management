import Book from "../models/Book.js";
import Transaction from "../models/Transaction.js";

// Search text mein special characters ko safe banata hai
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Helper: book dhoondo, na mile to 404
const findBookOr404 = async (id, res) => {
  const book = await Book.findById(id);
  if (!book) {
    res.status(404);
    throw new Error("Book not found");
  }
  return book;
};

// POST /api/books
export const createBook = async (req, res) => {
  const { title, author, category, isbn, quantity, publicationYear } = req.body;
  const book = await Book.create({
    title,
    author,
    category,
    isbn,
    quantity,
    publicationYear,
  });
  res.status(201).json({ success: true, message: "Book added successfully", data: book });
};

// GET /api/books?search=js&category=Programming
export const getBooks = async (req, res) => {
  const { search, category } = req.query;
  const filter = {};

  if (search && search.trim()) {
    const regex = new RegExp(escapeRegex(search.trim()), "i");
    filter.$or = [{ title: regex }, { author: regex }];
  }

  if (category && category.trim()) {
    filter.category = new RegExp(`^${escapeRegex(category.trim())}$`, "i");
  }

  const books = await Book.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, count: books.length, data: books });
};

// GET /api/books/categories  (frontend ke category dropdown ke liye)
export const getCategories = async (req, res) => {
  const categories = await Book.distinct("category");
  res.json({ success: true, data: categories.sort() });
};

// GET /api/books/:id
export const getBookById = async (req, res) => {
  const book = await findBookOr404(req.params.id, res);
  res.json({ success: true, data: book });
};

// PUT /api/books/:id
export const updateBook = async (req, res) => {
  const book = await findBookOr404(req.params.id, res);
  const { title, author, category, isbn, quantity, publicationYear } = req.body;

  // Quantity badle to availableQuantity bhi usi hisab se adjust ho
  if (quantity !== undefined) {
    const difference = Number(quantity) - book.quantity;
    const newAvailable = book.availableQuantity + difference;

    if (newAvailable < 0) {
      const issuedCopies = book.quantity - book.availableQuantity;
      res.status(400);
      throw new Error(
        `Quantity cannot be less than issued copies (${issuedCopies} currently issued)`
      );
    }
    book.quantity = quantity;
    book.availableQuantity = newAvailable;
  }

  if (title !== undefined) book.title = title;
  if (author !== undefined) book.author = author;
  if (category !== undefined) book.category = category;
  if (isbn !== undefined) book.isbn = isbn;
  if (publicationYear !== undefined) book.publicationYear = publicationYear;

  const updated = await book.save(); // save() validators bhi chalata hai
  res.json({ success: true, message: "Book updated successfully", data: updated });
};

// DELETE /api/books/:id
export const deleteBook = async (req, res) => {
  const book = await findBookOr404(req.params.id, res);

  // Agar book abhi kisi ke paas issued hai to delete nahi hogi
  const issuedCount = await Transaction.countDocuments({
    bookId: book._id,
    status: "Issued",
  });
  if (issuedCount > 0) {
    res.status(400);
    throw new Error("Cannot delete: this book is currently issued to a member");
  }

  await book.deleteOne();
  res.json({ success: true, message: "Book deleted successfully" });
};