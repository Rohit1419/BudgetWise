const API_URL = "https://budgetwise-lilac.vercel.app/api/v1" || "/api/v1/";

// Get all budgets for a specific month/year
export const getMonthlyBudgets = async (month, year) => {
  try {
    const response = await fetch(
      `${API_URL}/budgets/monthly?month=${month}&year=${year}`
    );
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching budgets:", error);
    throw error;
  }
};

// Set budget for a category
export const setBudget = async (budgetData) => {
  try {
    const response = await fetch(`${API_URL}/budgets/set`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(budgetData),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error setting budget:", error);
    throw error;
  }
};

// Delete a budget
export const deleteBudget = async (id) => {
  try {
    const response = await fetch(`${API_URL}/budgets/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error deleting budget ${id}:`, error);
    throw error;
  }
};
