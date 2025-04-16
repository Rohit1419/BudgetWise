import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import MonthlyExpensesChart from "@/components/MonthlyExpensesChart";
import CategoryPieChart from "@/components/CategoryPieChart";
import SummaryCards from "@/components/SummaryCards";
import BudgetSummary from "@/components/BudgetSummary";
import { getAllTransactions } from "@/services/transactionService";
import { getMonthlyBudgets } from "@/services/budgetService";
import Notification from "@/components/Notification";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  // State for transactions data
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for editing transactions
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // State for notifications
  const [notification, setNotification] = useState(null);

  // State for budgets
  const [budgets, setBudgets] = useState([]);

  // Current month and year
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Fetch transactions on component mount
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Fetch budgets on component mount
  useEffect(() => {
    fetchBudgets();
  }, []);

  // Function to fetch transactions from API
  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const data = await getAllTransactions();
      setTransactions(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Failed to load transactions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch budgets from API
  const fetchBudgets = async () => {
    try {
      const data = await getMonthlyBudgets(currentMonth, currentYear);
      setBudgets(data);
    } catch (err) {
      console.error("Error fetching budgets:", err);
      // We don't set the main error state here to avoid disrupting the transaction display
    }
  };

  // Show notification
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
  };

  // Handle adding or editing a transaction
  const handleTransactionSuccess = () => {
    fetchTransactions();
    setEditingTransaction(null);
    setShowForm(false);
    showNotification("Transaction saved successfully!");
  };

  // Handle editing a transaction
  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
    // Scroll to the form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle canceling edit
  const handleCancelEdit = () => {
    setEditingTransaction(null);
    setShowForm(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">
          Financial Dashboard
        </h1>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2"
        >
          <PlusIcon size={16} />
          {showForm ? "Hide Form" : "Add Transaction"}
        </Button>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Transaction Form (conditionally rendered) */}
      {showForm && (
        <div className="mb-8">
          <TransactionForm
            onSuccess={handleTransactionSuccess}
            editingTransaction={editingTransaction}
            onCancelEdit={handleCancelEdit}
          />
        </div>
      )}

      {/* Summary Cards */}
      <div className="mb-8">
        <SummaryCards transactions={transactions} />
      </div>

      {/* Budget Summary and Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div>
          <BudgetSummary
            transactions={transactions}
            budgets={budgets}
            currentMonth={currentMonth}
            currentYear={currentYear}
          />
          <div className="mt-4 text-center">
            <Link to="/budget">
              <Button variant="outline" className="w-full">
                Manage Budgets
              </Button>
            </Link>
          </div>
        </div>
        <div className="lg:col-span-2">
          <MonthlyExpensesChart
            transactions={transactions}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Category Distribution */}
      <div className="mb-8">
        <CategoryPieChart transactions={transactions} isLoading={isLoading} />
      </div>

      {/* Recent Transactions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
        <TransactionList
          transactions={transactions}
          isLoading={isLoading}
          onEdit={handleEditTransaction}
          onTransactionChange={fetchTransactions}
          limit={10} //Show only 5 most recent transactions
        />
        {transactions.length > 5 && (
          <div className="mt-4 text-center">
            <Link to="/transactions">
              <Button variant="outline">View All Transactions</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
