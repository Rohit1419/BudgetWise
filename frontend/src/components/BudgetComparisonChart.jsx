import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BudgetComparisonChart({
  transactions,
  budgets,
  month,
  year,
}) {
  // Format category name for display
  const formatCategoryName = (category) => {
    return category
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Format currency for tooltip
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  // Process data for the chart
  const chartData = useMemo(() => {
    if (!transactions?.length || !budgets?.length) {
      return [];
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

    // Combine budget and actual spending data
    const combinedData = [];

    // Add categories with budgets
    Object.keys(budgetMap).forEach((category) => {
      combinedData.push({
        category: formatCategoryName(category),
        rawCategory: category,
        budget: budgetMap[category],
        actual: categorySpending[category] || 0,
        // Calculate percentage of budget used
        percentUsed: categorySpending[category]
          ? Math.round((categorySpending[category] / budgetMap[category]) * 100)
          : 0,
        // Flag if over budget
        isOverBudget: (categorySpending[category] || 0) > budgetMap[category],
      });
    });

    // Add categories with spending but no budget
    Object.keys(categorySpending).forEach((category) => {
      if (!budgetMap[category]) {
        combinedData.push({
          category: formatCategoryName(category),
          rawCategory: category,
          budget: 0,
          actual: categorySpending[category],
          percentUsed: 100, // 100% if no budget
          isOverBudget: true, // Consider over budget if no budget set
        });
      }
    });

    // Sort by percentage used (descending)
    return combinedData.sort((a, b) => b.percentUsed - a.percentUsed);
  }, [transactions, budgets, month, year]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow-sm">
          <p className="font-semibold">{data.category}</p>
          <p>Budget: {formatCurrency(data.budget)}</p>
          <p>Actual: {formatCurrency(data.actual)}</p>
          <p
            className={`font-medium ${
              data.isOverBudget ? "text-red-600" : "text-green-600"
            }`}
          >
            {data.percentUsed}% of budget{" "}
            {data.isOverBudget ? "exceeded" : "used"}
          </p>
        </div>
      );
    }
    return null;
  };

  // Format month name
  const formatMonthYear = () => {
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
    return `${monthNames[parseInt(month)]} ${year}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget vs Actual Spending - {formatMonthYear()}</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex justify-center items-center h-64 text-gray-500">
            No budget data available
          </div>
        ) : (
          <div className="w-full">
            {/* Chart height grows with number of categories */}
            <div
              style={{ height: `${Math.max(350, chartData.length * 60)}px` }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tickFormatter={formatCurrency} />
                  <YAxis
                    type="category"
                    dataKey="category"
                    width={100}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />

                  {/* Budget bars */}
                  <Bar
                    dataKey="budget"
                    name="Budget"
                    fill="#0088FE"
                    barSize={20}
                  />

                  {/* Actual spending bars */}
                  <Bar dataKey="actual" name="Actual" barSize={20}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.isOverBudget ? "#FF6384" : "#4BC0C0"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Budget status summary */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-green-50 rounded-md">
                <p className="text-sm font-medium text-green-800">
                  Under Budget
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {chartData.filter((item) => !item.isOverBudget).length}
                </p>
                <p className="text-xs text-green-700">categories</p>
              </div>

              <div className="p-3 bg-red-50 rounded-md">
                <p className="text-sm font-medium text-red-800">Over Budget</p>
                <p className="text-2xl font-bold text-red-600">
                  {chartData.filter((item) => item.isOverBudget).length}
                </p>
                <p className="text-xs text-red-700">categories</p>
              </div>

              <div className="p-3 bg-blue-50 rounded-md">
                <p className="text-sm font-medium text-blue-800">
                  Total Budgeted
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(
                    chartData.reduce((sum, item) => sum + item.budget, 0)
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
