import { Router } from "express";
import {
  addTransaction,
  getALLTansactions,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transaction.controller.js";

const router = Router();

router.route("/add-transactions").post(addTransaction);
router.route("/all-transactions").get(getALLTansactions);
router.route("/transactions/:id").put(updateTransaction);
router.route("/transactions/:id").delete(deleteTransaction);

export default router;
