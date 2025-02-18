import mongoose from "mongoose"
import { Transaction } from "../models/transaction.models.js"

const addExpense = async (req, res) => {
    try {
        const { amount, description, date, category } = req.body
        const newExpense = new Transaction({
            amount,
            description,
            date,
            category
        })
        await newExpense.save()
        res.status(201).json({ status: 200, newExpense, message: "new expense is created to track" })
    } catch (error) {
        console.log(error)
    }
}

const getTransactions = async (req, res) => {
    try {
        const { query } = req.query
        let transactions
        if (query) {

            transactions = await Transaction.find({
                $or: [
                    { description: { $regex: query, $options: "i" } },
                    { category: { $regex: query, $options: "i" } },
                ],
            }).sort({ createdAt: -1 })
            return res.status(200).json({ transactions })
        }

        transactions = await Transaction.find().sort({ createdAt: -1 })
        return res.status(200).json({ transactions, message: "all transactions" })
    } catch (error) {
        console.log(error)
    }
}

const editExpense = async (req, res) => {
    try {
        const { id } = req.params
        const { amount, description, category } = req.body

        if (!amount || !description || !date || !category) {
            return res.status(400).json({ message: "all fields are required" })
        }

        const updatedExpense = await Transaction.findByIdAndUpdate(id,
            { amount, description, date, category },
            { new: true }
        )

        if (!updatedExpense) {
            return res.status(404).json({ message: "Expense not found" })
        }

        res.status(200).json({ updatedExpense, messsage: "expense updated" })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

const deleteExpense = async (req, res) => {
    try {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ message: "Transaction ID is required" });
        }

        const deletedExpense = await Transaction.findByIdAndDelete(id);

        if (!deletedExpense) {
            return res.status(404).json({ message: "Transaction not found or already deleted" });
        }

        res.status(200).json({ message: "Transaction deleted successfully", deletedExpense });
    } catch (error) {
        console.error("Error deleting transaction:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export { addExpense, getTransactions, editExpense, deleteExpense }