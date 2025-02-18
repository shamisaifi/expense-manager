import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema({
    month: { type: String, required: true, unique: true },
    budgets: [
        {
            category: String,
            amount: Number
        }
    ]
});

export const Budget = mongoose.model("Budget", budgetSchema)