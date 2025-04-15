import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CalendarIcon,
  PieChartIcon,
} from "lucide-react";

export default function SummaryCards({ transactions }) {
  const summaryData = useMemo(() => {
    if (!transactions.length) {
      return {
        totalIncome: 0,
        totalExpenses: 0,
        balance: 0,
        topCategory: "N/A",
        topCategoryAmount: 0,
        recentTransaction: null,
      };
    }

    // Calculate income (only transactions with "income" category)
    const totalIncome = transactions
      .filter((t) => t.category === "income")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    // Calculate expenses (all transactions except those with "income" category)
    const totalExpenses = transactions
      .filter((t) => t.category !== "income")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    // Calculate balance
    const balance = totalIncome - totalExpenses;

    // Find top spending category (excluding income)
    const categoryMap = transactions
      .filter((t) => t.category !== "income")
      .reduce((acc, t) => {
        const category = t.category;
        const amount = Math.abs(t.amount);

        if (!acc[category]) {
          acc[category] = 0;
        }

        acc[category] += amount;
        return acc;
      }, {});

    let topCategory = "N/A";
    let topCategoryAmount = 0;

    Object.entries(categoryMap).forEach(([category, amount]) => {
      if (amount > topCategoryAmount) {
        topCategory = category;
        topCategoryAmount = amount;
      }
    });

    // Find most recent transaction
    const recentTransaction = [...transactions].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    )[0];

    return {
      totalIncome,
      totalExpenses,
      balance,
      topCategory,
      topCategoryAmount,
      recentTransaction,
    };
  }, [transactions]);

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format category name for display
  const formatCategory = (category) => {
    if (!category || category === "N/A") return "N/A";
    return category
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Balance Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
          <div
            className={`p-1 rounded-full ${
              summaryData.balance >= 0 ? "bg-green-100" : "bg-red-100"
            }`}
          >
            {summaryData.balance >= 0 ? (
              <ArrowUpIcon className="h-4 w-4 text-green-600" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 text-red-600" />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(summaryData.balance)}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Income: {formatCurrency(summaryData.totalIncome)} | Expenses:{" "}
            {formatCurrency(summaryData.totalExpenses)}
          </p>
        </CardContent>
      </Card>

      {/* Total Expenses Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <div className="p-1 rounded-full bg-red-100">
            <ArrowDownIcon className="h-4 w-4 text-red-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(summaryData.totalExpenses)}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {transactions.filter((t) => t.category !== "income").length} expense
            transactions
          </p>
        </CardContent>
      </Card>

      {/* Top Category Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Top Category</CardTitle>
          <div className="p-1 rounded-full bg-blue-100">
            <PieChartIcon className="h-4 w-4 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCategory(summaryData.topCategory)}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {formatCurrency(summaryData.topCategoryAmount)}
          </p>
        </CardContent>
      </Card>

      {/* Recent Transaction Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Recent Transaction
          </CardTitle>
          <div className="p-1 rounded-full bg-purple-100">
            <CalendarIcon className="h-4 w-4 text-purple-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-md font-bold truncate">
            {summaryData.recentTransaction
              ? summaryData.recentTransaction.description
              : "No transactions"}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {summaryData.recentTransaction
              ? `${formatCurrency(
                  Math.abs(summaryData.recentTransaction.amount)
                )} • ${formatDate(summaryData.recentTransaction.date)}`
              : "N/A"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
