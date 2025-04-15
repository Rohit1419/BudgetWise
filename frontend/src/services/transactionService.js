import axios from "axios";

const API_URL = "http://localhost:5000/api/v1/transactions";

// Get all transactions
export const getAllTransactions = async () => {
  try {
    const response = await axios.get(`${API_URL}/all-transactions`);
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

// Add a new transaction
export const addTransaction = async (transaction) => {
  try {
    const response = await axios.post(
      `${API_URL}/add-transactions`,
      transaction
    );
    return response.data;
  } catch (error) {
    console.error("Error adding transaction:", error);
    throw error;
  }
};

// Get a single transaction
export const getTransaction = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/transaction/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching transaction:", error);
    throw error;
  }
};

// Update a transaction
export const updateTransaction = async (id, transaction) => {
  try {
    const response = await axios.put(
      `${API_URL}/transaction/${id}`,
      transaction
    );
    return response.data;
  } catch (error) {
    console.error("Error updating transaction:", error);
    throw error;
  }
};

// Delete a transaction
export const deleteTransaction = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/transactions/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting transaction:", error);
    throw error;
  }
};
