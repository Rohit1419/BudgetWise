import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function BudgetSummary({
  transactions,
  budgets,
  currentMonth,
  currentYear,
}) {
  const summary = useMemo(() => {
    if (!transactions?.length || !budgets?.length) {
      return {
        totalBudget: 0,
        totalSpent: 0,
        percentUsed: 0,
        overBudgetCount: 0,
      };
    }

    // Filter transactions for current month/year
    const currentMonthTransactions = transactions.filter((t) => {
      const date = new Date(t.date);
      return (
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear &&
        t.category !== "income"
      );
    });

    // Calculate total spending by category
    const spendingByCategory = currentMonthTransactions.reduce((acc, t) => {
      const category = t.category;
      if (!acc[category]) acc[category] = 0;
      acc[category] += Math.abs(t.amount);
      return acc;
    }, {});

    // Calculate total budget
    const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);

    // Calculate total spent
    const totalSpent = Object.values(spendingByCategory).reduce(
      (sum, amount) => sum + amount,
      0
    );

    // Calculate percentage used
    const percentUsed =
      totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

    // Count over-budget categories
    const overBudgetCount = budgets.reduce((count, budget) => {
      const spent = spendingByCategory[budget.category] || 0;
      return spent > budget.amount ? count + 1 : count;
    }, 0);

    return {
      totalBudget,
      totalSpent,
      percentUsed,
      overBudgetCount,
    };
  }, [transactions, budgets, currentMonth, currentYear]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Format month name
  const formatMonth = () => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return monthNames[currentMonth];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget for {formatMonth()}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Total Budget</span>
            <span className="font-medium">
              {formatCurrency(summary.totalBudget)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Spent So Far</span>
            <span className="font-medium">
              {formatCurrency(summary.totalSpent)}
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${
                summary.percentUsed > 100
                  ? "bg-red-600"
                  : summary.percentUsed > 80
                  ? "bg-yellow-500"
                  : "bg-green-600"
              }`}
              style={{ width: `${Math.min(summary.percentUsed, 100)}%` }}
            ></div>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span
              className={`font-medium ${
                summary.percentUsed > 100
                  ? "text-red-600"
                  : summary.percentUsed > 80
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            >
              {summary.percentUsed}% used
            </span>
            {summary.overBudgetCount > 0 && (
              <span className="text-red-600">
                {summary.overBudgetCount}{" "}
                {summary.overBudgetCount === 1 ? "category" : "categories"} over
                budget
              </span>
            )}
          </div>

          <Link
            to="/budget"
            className="flex items-center justify-center w-full text-sm text-blue-600 hover:text-blue-800 mt-2"
          >
            View Budget Details
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
