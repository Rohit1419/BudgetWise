import { response } from "express";
import { Transaction } from "../models/transaction.model.js";

// check transaction details from front end
// add transaction to db
//create  new transaction
//get all transactions
//delete transaction
//update transaction
// return response

export const addTransaction = async (req, res) => {
  try {
    const { amount, description, category } = req.body;

    if (amount === undefined || amount === null || isNaN(Number(amount))) {
      res
        .status(400)
        .json({ message: "Amount is required and must be a number" });
    }

    if (
      [description, category].some((field) => !field || field.trim() === "")
    ) {
      throw new Error(400, "All fields are required");
    }

    const transaction = await Transaction.create({
      amount,
      description,
      category,
    });

    res.status(201).json({
      message: "Transaction added successfully",
      transaction,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
    console.log(error);
  }
};

export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, description, category } = req.body;
    if (amount === undefined || amount === null || isNaN(Number(amount))) {
      res
        .status(400)
        .json({ message: "Amount is required and must be a number" });
    }
    if (
      [description, category].some((field) => !field || field.trim() === "")
    ) {
      res.status(400).json({ message: "All fields are required" });
    }
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      {
        amount,
        description,
        category,
      },
      { new: true, runValidators: true }
    );

    if (!updatedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({
      message: "Transaction updated successfully",
      updatedTransaction,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTransaction = await Transaction.findByIdAndDelete(id);
    if (!deletedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getCategoryWiseTransactions = async (req, res) => {
  try {
    const { category } = req.params;

    const transactions = await Transaction.find({ category });
    if (!transactions) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json(transactions);

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
