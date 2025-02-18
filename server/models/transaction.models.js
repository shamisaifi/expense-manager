import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    description: {
        type: String,
        required: true,
        minlength: 3
    },
    category: {
        type: String,
        enum: ["Food", "Rent", "Shopping", "Transportation", "Entertainment", "Savings", "Others"],
        required: true
    }
}, { timestamps: true });

export const Transaction = mongoose.model("Transaction", transactionSchema);
