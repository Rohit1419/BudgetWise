import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MonthlyExpensesChart({ transactions, isLoading }) {
  // Process transaction data to group by month
  const chartData = useMemo(() => {
    if (!transactions.length) return [];

    // Create an array of the last 6 months
    const today = new Date();
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(today, i);
      return {
        month: format(date, "MMM yyyy"),
        startDate: startOfMonth(date),
        endDate: endOfMonth(date),
        expenses: 0,
      };
    }).reverse();

    // Calculate expenses for each month
    transactions.forEach((transaction) => {
      if (transaction.amount < 0) {
        // Only count expenses (negative amounts)
        const transactionDate = new Date(transaction.date);
        const monthIndex = months.findIndex(
          (m) => transactionDate >= m.startDate && transactionDate <= m.endDate
        );

        if (monthIndex !== -1) {
          months[monthIndex].expenses += Math.abs(transaction.amount);
        }
      }
    });

    return months.map((m) => ({
      month: m.month,
      expenses: m.expenses,
    }));
  }, [transactions]);

  // Format currency values
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Show loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-64">
            Loading chart data...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex justify-center items-center h-64 text-gray-500">
            No expense data available yet.
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Bar
                  dataKey="expenses"
                  name="Expenses"
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
