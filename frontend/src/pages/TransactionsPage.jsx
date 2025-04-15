import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, PlusIcon } from "lucide-react";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import { getAllTransactions } from "@/services/transactionService";
import Notification from "@/components/Notification";
import { Link } from "react-router-dom";

export default function TransactionsPage() {
  // State for transactions data
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for editing transactions
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // State for notifications
  const [notification, setNotification] = useState(null);

  // Fetch transactions on component mount
  useEffect(() => {
    fetchTransactions();
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
        <div className="flex items-center mb-4 md:mb-0">
          <Link to="/">
            <Button variant="ghost" className="mr-2">
              <ArrowLeftIcon size={16} />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">All Transactions</h1>
        </div>
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

      {/* Transactions List */}
      <TransactionList
        transactions={transactions}
        isLoading={isLoading}
        onEdit={handleEditTransaction}
        onTransactionChange={fetchTransactions}
      />
    </div>
  );
}
