import { Router } from "express";
import * as expenseController from "../controllers/expense.controller";

const router = Router();

router.get("/", expenseController.getExpenses);
router.post("/", expenseController.createExpense);
router.put("/:id", expenseController.updateExpense);
router.delete("/:id", expenseController.deleteExpense);

export default router;
