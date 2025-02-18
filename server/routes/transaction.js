import express from "express"
import { addExpense, deleteExpense, editExpense, getTransactions } from "../controller/transaction.js"

const router = express.Router()

router.post("/addExpense", addExpense)
router.get("/allTransactions", getTransactions)
router.patch("/edit-expense", editExpense)
router.delete("/delete-expense", deleteExpense)

export default router