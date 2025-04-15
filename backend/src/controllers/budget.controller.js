import { Budget } from "../models/budget.model.js";

// Get all budgets for a specific month/year
export const getMonthlyBudgets = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ message: "Month and year are required" });
    }

    const budgets = await Budget.find({
      month: parseInt(month),
      year: parseInt(year),
    });

    res.status(200).json(budgets);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Set budget for a category
export const setBudget = async (req, res) => {
  try {
    const { category, amount, month, year } = req.body;

    if (!category || amount === undefined || !month || !year) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Use findOneAndUpdate with upsert to create or update
    const budget = await Budget.findOneAndUpdate(
      { category, month, year },
      { amount },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      message: "Budget set successfully",
      budget,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Delete a budget
export const deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBudget = await Budget.findByIdAndDelete(id);

    if (!deletedBudget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.status(200).json({ message: "Budget deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
