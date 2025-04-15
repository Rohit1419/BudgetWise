import mongoose from "mongoose";
import { Schema } from "mongoose";

const transactionSchema = new Schema(
  {
    amount: {
      type: Number,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Please select the catagory"],
      enum: [
        "income",
        "food & dining",
        "housing",
        "healthcare",
        "education",
        "entertainment",
        "shopping",
        "travel",
        "bills & utilities",
        "others",
      ],
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const Transaction = new mongoose.model("Transaction", transactionSchema);
