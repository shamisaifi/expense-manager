import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });
const app = express();
app.use(express.json());

app.use(cors({
    origin: "*"
}));

const PORT = process.env.PORT || 8000;
const URL = process.env.MONGO_URL;

mongoose.connect(URL)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port: ${PORT}`);
        });
    })
    .catch((err) => console.log("Cannot connect to the database: " + err));

import transactionRoute from "./routes/transaction.js";
import budgetRoute from "./routes/budget.js";

app.use("/transaction", transactionRoute);
app.use("/budget", budgetRoute);