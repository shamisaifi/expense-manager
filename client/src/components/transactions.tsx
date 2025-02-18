import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";

interface Transaction {
    _id: string;
    date: string;
    description: string;
    category: string;
    amount: number;
}

const Transactions = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [formData, setFormData] = useState<{ amount: string; description: string; date: string; category: string }>({
        amount: "",
        description: "",
        date: "",
        category: "",
    });

    useEffect(() => {
        fetchTransactions();
    }, [searchQuery]);

    const fetchTransactions = async () => {
        try {
            const response = await axios.get<{ transactions: Transaction[] }>(`${API_URL}/transaction/allTransactions?query=${searchQuery}`);
            setTransactions(response.data.transactions);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (txn: Transaction) => {
        setSelectedTransaction(txn);
        setFormData({
            amount: txn.amount.toString(),
            description: txn.description,
            date: txn.date.split("T")[0],
            category: txn.category,
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`${API_URL}/transaction/edit-expense?id=${selectedTransaction?._id}`, formData);
            alert("Transaction updated successfully!");
            fetchTransactions();
            setSelectedTransaction(null);
        } catch (error) {
            alert("Error updating transaction.");
            console.error("Error:", error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`${API_URL}/transaction/delete-expense/?id=${id}`);
            alert("Transaction deleted successfully!");
            fetchTransactions();
        } catch (error) {
            alert("Error deleting transaction.");
            console.error("Error:", error);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Transactions</h1>

            <input
                type="text"
                placeholder="Search by description, category, or amount..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
            />

            {loading ? <p className="text-center text-gray-500">Loading...</p> : null}

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                {transactions.length > 0 ? (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-3 border-b">Date</th>
                                <th className="p-3 border-b">Description</th>
                                <th className="p-3 border-b">Category</th>
                                <th className="p-3 border-b">Amount</th>
                                <th className="p-3 border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((txn) => (
                                <tr key={txn._id} className="border-b hover:bg-gray-50 transition">
                                    <td className="p-3">{new Date(txn.date).toLocaleDateString()}</td>
                                    <td className="p-3">{txn.description}</td>
                                    <td className="p-3">
                                        <span className="px-2 py-1 rounded bg-blue-200 text-blue-800 text-sm">{txn.category}</span>
                                    </td>
                                    <td className="p-3 font-semibold">₹{txn.amount}</td>
                                    <td className="p-3">
                                        <button onClick={() => handleEditClick(txn)} className="mr-2 bg-yellow-500 text-white px-3 py-1 rounded">
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(txn._id)} className="bg-red-500 text-white px-3 py-1 rounded">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-gray-500 text-center p-4">No transactions found.</p>
                )}
            </div>

            {selectedTransaction && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-lg font-bold mb-4">Edit Transaction</h2>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md mb-2"
                            placeholder="Amount"
                        />
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md mb-2"
                            placeholder="Description"
                        />
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md mb-2"
                        />
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md mb-2"
                        >
                            <option value="Food">Food</option>
                            <option value="Rent">Rent</option>
                            <option value="Shopping">Shopping</option>
                            <option value="Transportation">Transportation</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Savings">Savings</option>
                            <option value="Others">Others</option>
                        </select>
                        <div className="flex justify-end space-x-2">
                            <button onClick={handleUpdate} className="bg-blue-600 text-white px-4 py-2 rounded">
                                Update
                            </button>
                            <button onClick={() => setSelectedTransaction(null)} className="bg-gray-400 text-white px-4 py-2 rounded">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Transactions;
