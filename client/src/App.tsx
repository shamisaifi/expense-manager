import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/dashboard";
import Transactions from "./components/transactions";
import AddExpense from "./components/addExpense";
import Budget from "./components/budget";

import "./App.css"
import Navbar from "./components/navbar";


const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/add-expense" element={<AddExpense />} />
          <Route path="/set-budget" element={<Budget />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
