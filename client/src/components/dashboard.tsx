import { useState, useEffect } from "react"
import axios from "axios"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts"
import { Calendar, DollarSign, Wallet } from "lucide-react"
import { API_URL } from "../config"

const Dashboard = () => {
    const [transactions, setTransactions] = useState([])
    const [budget, setBudget] = useState(null)
    const [loading, setLoading] = useState(true)
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7))

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        setLoading(true)
        try {
            const [transactionRes, budgetRes] = await Promise.all([
                axios.get(`${API_URL}/transaction/allTransactions`),
                axios.get(`${API_URL}/budget/getBudget/${month}`),
            ])

            setTransactions(transactionRes.data.transactions)
            setBudget(budgetRes.data || null)
        } catch (error) {
            console.error("Error fetching dashboard data:", error)
        } finally {
            setLoading(false)
        }
    }

    if (loading)
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
            </div>
        )

    const totalExpenses = transactions.reduce((acc, txn) => acc + txn.amount, 0)
    const totalBudget = budget?.budgets.reduce((acc, item) => acc + item.amount, 0) || 0
    const remainingBudget = totalBudget - totalExpenses

    const categoryExpenses = transactions.reduce((acc, txn) => {
        acc[txn.category] = (acc[txn.category] || 0) + txn.amount
        return acc
    }, {})

    const pieData = Object.keys(categoryExpenses).map((category) => ({
        name: category,
        value: categoryExpenses[category],
    }))

    const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#6366F1"]

    const budgetChartData =
        budget?.budgets.map(({ category, amount }) => ({
            category,
            budgeted: amount,
            spent: categoryExpenses[category] || 0,
        })) || []

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Financial Dashboard</h1>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Month:</label>
                <input
                    type="month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-700">Total Expenses</h2>
                        <DollarSign className="h-8 w-8 text-blue-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mt-2">₹{totalExpenses.toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-700">Remaining Budget</h2>
                        <Wallet className="h-8 w-8 text-green-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                        ₹{(remainingBudget >= 0 ? remainingBudget : 0).toLocaleString()}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-700">Total Budget</h2>
                        <Calendar className="h-8 w-8 text-purple-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mt-2">₹{totalBudget.toLocaleString()}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Budget vs. Expenses</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={budgetChartData}>
                            <XAxis dataKey="category" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="budgeted" fill="#10B981" name="Budgeted" />
                            <Bar dataKey="spent" fill="#EF4444" name="Spent" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Category Breakdown</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                {pieData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Legend />
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Transactions</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-3 font-semibold text-gray-600">Date</th>
                                <th className="p-3 font-semibold text-gray-600">Category</th>
                                <th className="p-3 font-semibold text-gray-600">Description</th>
                                <th className="p-3 font-semibold text-gray-600">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.slice(0, 5).map((txn, index) => (
                                <tr key={index} className="border-b border-gray-200">
                                    <td className="p-3 text-gray-700">{new Date(txn.date).toLocaleDateString()}</td>
                                    <td className="p-3 text-gray-700">{txn.category}</td>
                                    <td className="p-3 text-gray-700">{txn.description}</td>
                                    <td className="p-3 text-gray-700">₹{txn.amount.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {transactions.length === 0 && <p className="text-center text-gray-500 py-4">No transactions yet</p>}
                </div>
            </div>
        </div>
    )
}

export default Dashboard

