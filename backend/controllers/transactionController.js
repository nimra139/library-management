import Book from "../models/Book.js";
import Member from "../models/Member.js";
import Transaction from "../models/Transaction.js";

// POST /api/transactions/issue
export const issueBook = async (req, res) => {
  const { bookId, memberId } = req.body;

  // 1. Dono ID di gayi hain?
  if (!bookId || !memberId) {
    res.status(400);
    throw new Error("bookId and memberId are required");
  }

  // 2. Book maujood hai?
  const book = await Book.findById(bookId);
  if (!book) {
    res.status(404);
    throw new Error("Book not found");
  }

  // 3. Member maujood hai?
  const member = await Member.findById(memberId);
  if (!member) {
    res.status(404);
    throw new Error("Member not found");
  }

  // 4. Book available hai?
  if (book.availableQuantity <= 0) {
    res.status(400);
    throw new Error("Book is not available");
  }

  // 5. Transaction banao
  const transaction = await Transaction.create({ bookId, memberId });

  // 6. availableQuantity 1 kam karo
  book.availableQuantity -= 1;
  await book.save();

  res.status(201).json({
    success: true,
    message: "Book issued successfully",
    data: transaction,
  });
};
// PUT /api/transactions/:id/return
export const returnBook = async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);
  if (!transaction) {
    res.status(404);
    throw new Error("Transaction not found");
  }

  if (transaction.status === "Returned") {
    res.status(400);
    throw new Error("This book is already returned");
  }

  transaction.status = "Returned";
  transaction.returnDate = new Date();
  await transaction.save();

  const book = await Book.findById(transaction.bookId);
  if (book) {
    book.availableQuantity += 1;
    await book.save();
  }

  res.json({ success: true, message: "Book returned successfully", data: transaction });
};

// GET /api/transactions?status=Issued
// GET /api/transactions?status=Issued&bookId=...
export const getTransactions = async (req, res) => {
  const { status, bookId } = req.query;
  const filter = {};
  if (status && status.trim()) filter.status = status.trim();
  if (bookId && bookId.trim()) filter.bookId = bookId.trim();

  const transactions = await Transaction.find(filter)
    .populate("bookId", "title author isbn")
    .populate("memberId", "name email")
    .sort({ createdAt: -1 });

  res.json({ success: true, count: transactions.length, data: transactions });
};

// GET /api/transactions/issued
export const getIssuedTransactions = async (req, res) => {
  const transactions = await Transaction.find({ status: "Issued" })
    .populate("bookId", "title author isbn")
    .populate("memberId", "name email")
    .sort({ createdAt: -1 });

  res.json({ success: true, count: transactions.length, data: transactions });
};