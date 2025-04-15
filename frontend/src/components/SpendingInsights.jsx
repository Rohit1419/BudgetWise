import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  DollarSign,
} from "lucide-react";

export default function SpendingInsights({
  transactions,
  budgets,
  month,
  year,
}) {
  const insights = useMemo(() => {
    if (!transactions?.length || !budgets?.length) {
      return {
        overBudgetCategories: [],
        nearBudgetCategories: [],
        underUtilizedCategories: [],
        topExpenseCategory: null,
        hasInsights: false,
      };
    }

    // Filter transactions for the current month/year
    const currentMonthTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return (
        transactionDate.getMonth() === parseInt(month) &&
        transactionDate.getFullYear() === parseInt(year) &&
        t.category !== "income" // Exclude income
      );
    });

    // Group transactions by category and sum amounts
    const categorySpending = currentMonthTransactions.reduce(
      (acc, transaction) => {
        const category = transaction.category;
        const amount = Math.abs(transaction.amount);

        if (!acc[category]) {
          acc[category] = 0;
        }

        acc[category] += amount;
        return acc;
      },
      {}
    );

    // Create a map of budgets by category
    const budgetMap = budgets.reduce((acc, budget) => {
      acc[budget.category] = budget.amount;
      return acc;
    }, {});

    // Find categories over budget (>100%)
    const overBudgetCategories = Object.keys(categorySpending)
      .filter(
        (category) =>
          budgetMap[category] &&
          categorySpending[category] > budgetMap[category]
      )
      .map((category) => ({
        category,
        budget: budgetMap[category],
        actual: categorySpending[category],
        percentUsed: Math.round(
          (categorySpending[category] / budgetMap[category]) * 100
        ),
      }))
      .sort((a, b) => b.percentUsed - a.percentUsed);

    // Find categories near budget (80-99%)
    const nearBudgetCategories = Object.keys(categorySpending)
      .filter(
        (category) =>
          budgetMap[category] &&
          categorySpending[category] >= budgetMap[category] * 0.8 &&
          categorySpending[category] <= budgetMap[category]
      )
      .map((category) => ({
        category,
        budget: budgetMap[category],
        actual: categorySpending[category],
        percentUsed: Math.round(
          (categorySpending[category] / budgetMap[category]) * 100
        ),
      }))
      .sort((a, b) => b.percentUsed - a.percentUsed);

    // Find under-utilized categories (<30% used)
    const underUtilizedCategories = Object.keys(budgetMap)
      .filter(
        (category) =>
          !categorySpending[category] ||
          categorySpending[category] < budgetMap[category] * 0.3
      )
      .map((category) => ({
        category,
        budget: budgetMap[category],
        actual: categorySpending[category] || 0,
        percentUsed: categorySpending[category]
          ? Math.round((categorySpending[category] / budgetMap[category]) * 100)
          : 0,
      }))
      .sort((a, b) => a.percentUsed - b.percentUsed);

    // Find top expense category
    let topCategory = null;
    let topAmount = 0;

    Object.entries(categorySpending).forEach(([category, amount]) => {
      if (amount > topAmount) {
        topCategory = category;
        topAmount = amount;
      }
    });

    // Calculate total budget and spending
    const totalBudget = Object.values(budgetMap).reduce(
      (sum, amount) => sum + amount,
      0
    );
    const totalSpending = Object.values(categorySpending).reduce(
      (sum, amount) => sum + amount,
      0
    );
    const overallPercentUsed =
      totalBudget > 0 ? Math.round((totalSpending / totalBudget) * 100) : 0;

    return {
      overBudgetCategories,
      nearBudgetCategories,
      underUtilizedCategories,
      topExpenseCategory: topCategory
        ? {
            category: topCategory,
            amount: topAmount,
            percentOfTotal: Math.round((topAmount / totalSpending) * 100),
          }
        : null,
      totalBudget,
      totalSpending,
      overallPercentUsed,
      hasInsights: true,
    };
  }, [transactions, budgets, month, year]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Format category name for display
  const formatCategory = (category) => {
    if (!category) return "";
    return category
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (!insights.hasInsights) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Budget Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div
            className={`p-4 rounded-lg ${
              insights.overallPercentUsed > 100
                ? "bg-red-50"
                : insights.overallPercentUsed > 80
                ? "bg-yellow-50"
                : "bg-green-50"
            }`}
          >
            <h3 className="text-sm font-medium mb-1">Overall Budget</h3>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">
                {insights.overallPercentUsed}%
              </span>
              <span className="text-sm">Used</span>
            </div>
            <div className="text-xs mt-1">
              {formatCurrency(insights.totalSpending)} of{" "}
              {formatCurrency(insights.totalBudget)}
            </div>
          </div>

          {insights.topExpenseCategory && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium mb-1">Top Expense</h3>
              <div className="text-lg font-semibold">
                {formatCategory(insights.topExpenseCategory.category)}
              </div>
              <div className="flex justify-between items-center text-xs mt-1">
                <span>
                  {formatCurrency(insights.topExpenseCategory.amount)}
                </span>
                <span>
                  {insights.topExpenseCategory.percentOfTotal}% of total
                </span>
              </div>
            </div>
          )}

          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="text-sm font-medium mb-1">Budget Status</h3>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-lg font-semibold text-red-600">
                  {insights.overBudgetCategories.length}
                </div>
                <div className="text-xs">Over</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-yellow-600">
                  {insights.nearBudgetCategories.length}
                </div>
                <div className="text-xs">Near</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-green-600">
                  {insights.underUtilizedCategories.length}
                </div>
                <div className="text-xs">Under</div>
              </div>
            </div>
          </div>
        </div>

        {/* Over Budget Warning */}
        {insights.overBudgetCategories.length > 0 && (
          <div className="p-4 bg-red-50 rounded-lg">
            <div className="flex items-center mb-2">
              <TrendingUp className="h-5 w-5 text-red-600 mr-2" />
              <h3 className="font-semibold text-red-800">
                Over Budget Categories
              </h3>
            </div>
            <ul className="space-y-2">
              {insights.overBudgetCategories.map((item, index) => (
                <li key={index} className="flex justify-between text-sm">
                  <span>{formatCategory(item.category)}</span>
                  <span className="font-medium text-red-600">
                    {item.percentUsed}% used ({formatCurrency(item.actual)} of{" "}
                    {formatCurrency(item.budget)})
                  </span>
                </li>
              ))}
            </ul>
            {insights.overBudgetCategories.length > 0 && (
              <p className="text-xs text-red-700 mt-2">
                Consider adjusting your spending in these categories or revising
                your budget.
              </p>
            )}
          </div>
        )}

        {/* Near Budget Alert */}
        {insights.nearBudgetCategories.length > 0 && (
          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
              <h3 className="font-semibold text-yellow-800">
                Approaching Budget Limit
              </h3>
            </div>
            <ul className="space-y-2">
              {insights.nearBudgetCategories.map((item, index) => (
                <li key={index} className="flex justify-between text-sm">
                  <span>{formatCategory(item.category)}</span>
                  <span className="font-medium text-yellow-600">
                    {item.percentUsed}% used ({formatCurrency(item.actual)} of{" "}
                    {formatCurrency(item.budget)})
                  </span>
                </li>
              ))}
            </ul>
            {insights.nearBudgetCategories.length > 0 && (
              <p className="text-xs text-yellow-700 mt-2">
                You're close to your budget limit in these categories. Monitor
                your spending carefully.
              </p>
            )}
          </div>
        )}

        {/* Under-utilized Categories */}
        {insights.underUtilizedCategories.length > 0 && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center mb-2">
              <TrendingDown className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="font-semibold text-blue-800">
                Under-utilized Budgets
              </h3>
            </div>
            <ul className="space-y-2">
              {insights.underUtilizedCategories.map((item, index) => (
                <li key={index} className="flex justify-between text-sm">
                  <span>{formatCategory(item.category)}</span>
                  <span className="font-medium text-blue-600">
                    {item.percentUsed}% used ({formatCurrency(item.actual)} of{" "}
                    {formatCurrency(item.budget)})
                  </span>
                </li>
              ))}
            </ul>
            {insights.underUtilizedCategories.length > 0 && (
              <p className="text-xs text-blue-700 mt-2">
                You might want to reallocate some of this budget to categories
                where you need more funds.
              </p>
            )}
          </div>
        )}

        {/* Tips Section */}
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center mb-2">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <h3 className="font-semibold text-green-800">Budget Tips</h3>
          </div>
          <ul className="space-y-1 text-sm text-green-700">
            {insights.overBudgetCategories.length > 0 && (
              <li>
                • Try to reduce spending in over-budget categories for the rest
                of the month.
              </li>
            )}
            {insights.underUtilizedCategories.length > 0 && (
              <li>
                • Consider reallocating funds from under-utilized categories.
              </li>
            )}
            {insights.topExpenseCategory && (
              <li>
                • Your highest expense is in{" "}
                {formatCategory(insights.topExpenseCategory.category)}. Look for
                ways to optimize this spending.
              </li>
            )}
            {insights.overallPercentUsed > 90 && (
              <li>
                • You're using {insights.overallPercentUsed}% of your total
                budget. Be careful with additional expenses.
              </li>
            )}
            {insights.overallPercentUsed < 50 &&
              insights.overallPercentUsed > 0 && (
                <li>
                  • You're only using {insights.overallPercentUsed}% of your
                  total budget. Consider saving the extra or reviewing if your
                  budgets are realistic.
                </li>
              )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
