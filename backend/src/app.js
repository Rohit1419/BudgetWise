import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Updated CORS configuration to allow requests from everywhere
app.use(
  cors({
    origin: "*", // Allow all origins
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// routes import
import transactionRoutes from "./routes/transaction.route.js";
import budgetRoutes from "./routes/budget.route.js";

// routes declaration
app.use("/api/v1/transactions", transactionRoutes);
app.use("/api/v1/budgets", budgetRoutes);

app.get("/", (req, res) => {
  res.send("BudgetWise API is running");
});

export default app;
