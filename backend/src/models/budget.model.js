import mongoose from "mongoose";
import { Schema } from "mongoose";

const budgetSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
      enum: [
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
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    month: {
      type: Number, // 0-11 (Jan-Dec)
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// Compound index to ensure unique budget per category per month/year
budgetSchema.index({ category: 1, month: 1, year: 1 }, { unique: true });

export const Budget = new mongoose.model("Budget", budgetSchema);
