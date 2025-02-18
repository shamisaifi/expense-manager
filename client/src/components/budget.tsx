import { useState } from "react";
import axios from "axios";

const categories = ["Food", "Rent", "Shopping", "Transportation", "Entertainment", "Savings", "Others"];

const Budget = () => {
    const [budgets, setBudgets] = useState(categories.map(category => ({ category, amount: 0 })));
    const [month, setMonth] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, category: string) => {
        const value = parseFloat(e.target.value) || 0;
        setBudgets(prevBudgets =>
            prevBudgets.map(budget =>
                budget.category === category ? { ...budget, amount: value } : budget
            )
        );
    };


    const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMonth(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!month) {
            setMessage("Please select a valid month.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post("http://localhost:5000/budget/setBudget", { month, budgets });
            setMessage(response.data.message);
        } catch (error) {
            setMessage("Error setting budget.");
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Set Monthly Budget</h1>

            {message && (
                <p className={`p-2 text-center rounded ${message.includes("Error") ? "bg-red-200 text-red-700" : "bg-green-200 text-green-700"}`}>
                    {message}
                </p>
            )}

            <label className="block mb-2 font-medium">Select Month:</label>
            <input
                type="month"
                value={month}
                placeholder="YYYY-MM"
                onChange={handleMonthChange}
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
            />

            <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-lg space-y-4">
                {budgets.map(({ category, amount }) => (
                    <div key={category} className="flex justify-between items-center">
                        <label className="text-gray-700">{category}</label>
                        <input
                            type="number"
                            min="0"
                            value={amount || ""}
                            onChange={(e) => handleInputChange(e, category)}
                            className="w-38 p-2 border border-gray-300 rounded-md"
                            placeholder="Enter amount"
                        />
                    </div>
                ))}

                <div className="flex justify-end space-x-2 mt-4">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        disabled={loading}
                    >
                        {loading ? "Setting..." : "Save Budget"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Budget;
