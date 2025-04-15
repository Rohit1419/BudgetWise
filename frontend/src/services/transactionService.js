const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1/transactions";

// Get all transactions
export const getAllTransactions = async () => {
  try {
    const response = await fetch(`${API_URL}/all-transactions`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

// Get a single transaction
export const getTransaction = async (id) => {
  try {
    const response = await fetch(`${API_URL}/transaction/${id}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching transaction ${id}:`, error);
    throw error;
  }
};

// Add a new transaction
export const addTransaction = async (transactionData) => {
  try {
    const response = await fetch(`${API_URL}/add-transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transactionData),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding transaction:", error);
    throw error;
  }
};

// Update a transaction
export const updateTransaction = async (id, transactionData) => {
  try {
    const response = await fetch(`${API_URL}/transaction/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transactionData),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error updating transaction ${id}:`, error);
    throw error;
  }
};

// Delete a transaction
export const deleteTransaction = async (id) => {
  try {
    const response = await fetch(`${API_URL}/transactions/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error deleting transaction ${id}:`, error);
    throw error;
  }
};

// Get transactions by category
export const getTransactionsByCategory = async (category) => {
  try {
    const response = await fetch(`${API_URL}/transactions/${category}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(
      `Error fetching transactions for category ${category}:`,
      error
    );
    throw error;
  }
};
