import express from "express";
import {
  createBook,
  getBooks,
  getCategories,
  getBookById,
  updateBook,
  deleteBook,
} from "../controllers/bookController.js";

const router = express.Router();

router.route("/").get(getBooks).post(createBook);

// "/categories" ko "/:id" se PEHLE rakhna zaroori hai,
// warna "categories" ko ID samajh liya jayega
router.get("/categories", getCategories);

router.route("/:id").get(getBookById).put(updateBook).delete(deleteBook);

export default router;