## 🛠️ Tech Stack

- **Frontend:** React (with Vite)
- **Backend:** Node.js & Express.js
- **Database:** MongoDB (Mongoose ODM)
- **API Handling:** Axios
- **State Management:** React Hooks
- **Graphs:** Recharts
- **Icons:** lucide react

## 📦 Project Setup

### 1️⃣ Clone the Repository
git clone https://github.com/shamisaifi/expense-manager.git

### 2️⃣ Install Dependencies
npm i

### 3️⃣ Set Up Environment Variables
Create a `.env` file in the root directory and add:

MONGO_URL=
PORT=5000

### 4️⃣ Start the Backend Server
npm start

### 5️⃣ Start the Frontend
npm run dev

## 🔥 API Endpoints

### **Budget Routes**
- `POST /budget/setBudget` - Set a new budget.
- `GET /budget/getBudget` - Retrieve the current budget.

### **Transaction Routes**
- `GET /transaction/allTransactions` - Add a new transaction.
- `POST /transaction/addExpense` - Retrieve all transactions.
- `PATCH /transaction/edit-expense` - update transaction.
- `DELETE /transaction/delete-expense` - delete transaction.
