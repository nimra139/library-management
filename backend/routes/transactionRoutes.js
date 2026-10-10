import express from "express";
import {
  issueBook,
  returnBook,
  getTransactions,
  getIssuedTransactions,
} from "../controllers/transactionController.js";

const router = express.Router();

router.get("/", getTransactions);
router.post("/issue", issueBook);
router.get("/issued", getIssuedTransactions);
router.put("/:id/return", returnBook);

export default router;