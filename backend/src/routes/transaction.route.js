import { Router } from "express";
import {
  addTransaction,
  getAllTransactions,
  updateTransaction,
  deleteTransaction,
  getTransaction,
  getCategoryWiseTransactions,
} from "../controllers/transaction.controller.js";

const router = Router();

router.route("/add-transactions").post(addTransaction);
router.route("/all-transactions").get(getAllTransactions);
router.route("/transaction/:id").get(getTransaction);
router.route("/transaction/:id").put(updateTransaction);
router.route("/transactions/:id").delete(deleteTransaction);
router.route("/transactions/:category").get(getCategoryWiseTransactions);

export default router;
