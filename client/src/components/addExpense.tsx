import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { API_URL } from "../config";

const categories = ["Food", "Rent", "Shopping", "Transportation", "Entertainment", "Savings", "Others"];

const expenseSchema = z.object({
    amount: z.number().positive("Amount must be greater than zero"),
    description: z.string().min(3, "Description must be at least 3 characters"),
    date: z.string().nonempty("Date is required"),
    category: z.enum(["Food", "Rent", "Shopping", "Transportation", "Entertainment", "Savings", "Others"]),
});

const AddExpense = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(expenseSchema),
    });

    const onSubmit = async (data: any) => {
        try {
            setLoading(true);
            await axios.post(`${API_URL}/transaction/addExpense`, data);
            setMessage("Expense added successfully!");
            reset();
        } catch (error) {
            setMessage("Error adding expense.");
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Add Expense</h1>

            {message && <p className={`p-2 text-center rounded ${message.includes("Error") ? "bg-red-200 text-red-700" : "bg-green-200 text-green-700"}`}>{message}</p>}

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 shadow-md rounded-lg space-y-4">
                <div>
                    <label className="block text-gray-700">Amount</label>
                    <input
                        type="number"
                        {...register("amount", { valueAsNumber: true })}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Enter amount"
                    />
                    {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
                </div>

                <div>
                    <label className="block text-gray-700">Description</label>
                    <input
                        type="text"
                        {...register("description")}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Enter description"
                    />
                    {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                </div>

                <div>
                    <label className="block text-gray-700">Date</label>
                    <input
                        type="date"
                        {...register("date")}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
                </div>

                <div>
                    <label className="block text-gray-700">Category</label>
                    <select {...register("category")} className="w-full p-2 border border-gray-300 rounded-md">
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                    {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
                    disabled={loading}
                >
                    {loading ? "Adding..." : "Add Expense"}
                </button>
            </form>
        </div>
    );
};

export default AddExpense;
