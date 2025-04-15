import dotenv from "dotenv";
import dbConnect from "./db/db.js";
import app from "./app.js";

dotenv.config({
  path: ".env",
});

// Connect to database
dbConnect()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.log("Database connection error:", error);
  });

// For local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`);
  });
}

// Export the Express app for Vercel
export default app;
