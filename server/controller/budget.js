import { Budget } from "../models/budget.models.js";

const setBudget = async (req, res) => {
    try {
        let { month, budgets } = req.body;

        if (!month || !Array.isArray(budgets) || budgets.length === 0) {
            return res.status(400).json({ message: "Month and budgets array are required" });
        }

        month = new Date(month).toISOString().slice(0, 7);

        budgets = budgets.map(budget => ({
            category: budget.category,
            amount: Math.max(0, parseFloat(budget.amount) || 0)
        }));

        const existingBudget = await Budget.findOne({ month });

        if (existingBudget) {
            existingBudget.budgets = budgets;
            await existingBudget.save();
            return res.status(200).json({ budget: existingBudget, message: "Budget updated successfully" });
        } else {
            const newBudget = new Budget({ month, budgets });
            await newBudget.save();
            return res.status(201).json({ budget: newBudget, message: "New budget created successfully" });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


const getBudget = async (req, res) => {
    try {
        const { month } = req.params;
        const budget = await Budget.findOne({ month });

        if (!budget) {
            return res.status(404).json({ message: "No budget found for this month" });
        }

        return res.status(200).json(budget);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


export { setBudget, getBudget }