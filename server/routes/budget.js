import express from "express"
import { getBudget, setBudget } from "../controller/budget.js"

const router = express.Router()

router.post("/setBudget", setBudget)
router.get("/getBudget/:month", getBudget)

export default router