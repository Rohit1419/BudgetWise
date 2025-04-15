import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Predefined colors for categories
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A259FF",
  "#4BC0C0",
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#8884D8",
];

export default function CategoryPieChart({ transactions }) {
  // Format category name for display - MOVED THIS FUNCTION BEFORE useMemo
  const formatCategoryName = (category) => {
    return category
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Format currency for tooltip - MOVED THIS FUNCTION BEFORE useMemo TOO
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  // Process data for the pie chart
  const chartData = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return [];
    }

    // Only include expense transactions (non-income)
    const expenseTransactions = transactions.filter(
      (t) => t.category !== "income"
    );

    // Group by category and sum amounts
    const categoryMap = expenseTransactions.reduce((acc, transaction) => {
      const category = transaction.category;
      const amount = Math.abs(transaction.amount);

      if (!acc[category]) {
        acc[category] = 0;
      }

      acc[category] += amount;
      return acc;
    }, {});

    // Calculate total expenses
    const totalExpenses = Object.values(categoryMap).reduce(
      (sum, amount) => sum + amount,
      0
    );

    // Convert to array format needed for recharts
    return Object.entries(categoryMap).map(([category, amount], index) => ({
      name: formatCategoryName(category),
      value: amount,
      percentage: ((amount / totalExpenses) * 100).toFixed(1),
      color: COLORS[index % COLORS.length],
    }));
  }, [transactions]);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border rounded shadow-sm">
          <p className="font-semibold">{data.name}</p>
          <p>
            {formatCurrency(data.value)} ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom legend that includes percentages
  const renderCustomizedLegend = (props) => {
    const { payload } = props;

    return (
      <ul className="flex flex-wrap justify-center gap-2 mt-4">
        {payload.map((entry, index) => (
          <li
            key={`item-${index}`}
            className="flex items-center text-xs md:text-sm"
          >
            <div
              className="w-3 h-3 mr-1"
              style={{ backgroundColor: entry.color }}
            />
            <span className="mr-1">{entry.value}</span>
            <span className="text-gray-500">
              ({chartData[index].percentage}%)
            </span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex justify-center items-center h-64 text-gray-500">
            No expense data available
          </div>
        ) : (
          <div className="w-full">
            {/* Chart container with responsive height */}
            <div className="h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius="80%"
                    innerRadius="40%" // Make it a donut chart for better visual
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    content={renderCustomizedLegend}
                    verticalAlign="bottom"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
