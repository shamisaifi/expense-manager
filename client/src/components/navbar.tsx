import { NavLink } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="bg-blue-600 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold">Finance Tracker</h1>

                <div className="flex space-x-6">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `px-3 py-2 rounded ${isActive ? "bg-white text-blue-600 font-semibold" : "hover:bg-blue-500"}`
                        }
                    >
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/transactions"
                        className={({ isActive }) =>
                            `px-3 py-2 rounded ${isActive ? "bg-white text-blue-600 font-semibold" : "hover:bg-blue-500"}`
                        }
                    >
                        Transactions
                    </NavLink>

                    <NavLink
                        to="/add-expense"
                        className={({ isActive }) =>
                            `px-3 py-2 rounded ${isActive ? "bg-white text-blue-600 font-semibold" : "hover:bg-blue-500"}`
                        }
                    >
                        Add Expense
                    </NavLink>

                    <NavLink
                        to="/set-budget"
                        className={({ isActive }) =>
                            `px-3 py-2 rounded ${isActive ? "bg-white text-blue-600 font-semibold" : "hover:bg-blue-500"}`
                        }
                    >
                        Set Budget
                    </NavLink>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
