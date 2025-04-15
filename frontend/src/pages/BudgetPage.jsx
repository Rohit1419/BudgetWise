import { useState, useEffect } from "react";
import { getMonthlyBudgets } from "@/services/budgetService";
import { getAllTransactions } from "@/services/transactionService";
import BudgetForm from "@/components/BudgetForm";
import BudgetComparisonChart from "@/components/BudgetComparisonChart";
import BudgetList from "@/components/BudgetList";
import SpendingInsights from "@/components/SpendingInsights";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function BudgetPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Load budgets and transactions
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [budgetData, transactionData] = await Promise.all([
        getMonthlyBudgets(currentMonth, currentYear),
        getAllTransactions(),
      ]);

      setBudgets(budgetData);
      setTransactions(transactionData);
    } catch (error) {
      console.error("Error loading budget data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentMonth, currentYear]);

  // Navigate to previous month
  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  // Navigate to next month
  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
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
    return `${monthNames[currentMonth]} ${currentYear}`;
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Budget Management</h1>

        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={goToPreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="font-medium">{formatMonthYear()}</span>

          <Button variant="outline" onClick={goToNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Budget Form */}
        <div>
          <BudgetForm
            onSuccess={loadData}
            currentMonth={currentMonth}
            currentYear={currentYear}
          />
        </div>

        {/* Budget List */}
        <div className="lg:col-span-2">
          <BudgetList
            budgets={budgets}
            onBudgetChange={loadData}
            isLoading={isLoading}
            month={currentMonth}
            year={currentYear}
          />
        </div>
      </div>

      {/* Budget Comparison Chart */}
      <BudgetComparisonChart
        transactions={transactions}
        budgets={budgets}
        month={currentMonth}
        year={currentYear}
      />

      {/* Spending Insights */}
      <SpendingInsights
        transactions={transactions}
        budgets={budgets}
        month={currentMonth}
        year={currentYear}
      />
    </div>
  );
}
