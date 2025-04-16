import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Updated CORS configuration
const allowedOrigins = [
  process.env.CORS_ORIGIN,
  "https://your-frontend-vercel-url.vercel.app",
  // Include localhost for development
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
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
