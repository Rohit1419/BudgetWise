import { Router } from "express";
import {
  getMonthlyBudgets,
  setBudget,
  deleteBudget,
} from "../controllers/budget.controller.js";

const router = Router();

router.route("/monthly").get(getMonthlyBudgets);
router.route("/set").post(setBudget);
router.route("/:id").delete(deleteBudget);

export default router;
