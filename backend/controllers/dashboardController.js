import Book from "../models/Book.js";
import Member from "../models/Member.js";
import Transaction from "../models/Transaction.js";

// GET /api/dashboard
export const getDashboardStats = async (req, res) => {
  const [totalBooks, totalMembers, issuedBooks, returnedBooks, availableAgg] =
    await Promise.all([
      Book.countDocuments(),
      Member.countDocuments(),
      Transaction.countDocuments({ status: "Issued" }),
      Transaction.countDocuments({ status: "Returned" }),
      Book.aggregate([
        { $group: { _id: null, total: { $sum: "$availableQuantity" } } },
      ]),
    ]);

  res.json({
    success: true,
    data: {
      totalBooks,
      totalMembers,
      issuedBooks,
      returnedBooks,
      availableBooks: availableAgg[0]?.total || 0,
    },
  });
};