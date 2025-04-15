import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// routes import
import transactionRoutes from "./routes/transaction.route.js";

// routes declaration

app.use("/api/v1/transactions", transactionRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

export default app;
