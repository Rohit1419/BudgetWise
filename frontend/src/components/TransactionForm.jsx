import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  addTransaction,
  updateTransaction,
} from "@/services/transactionService";

// Predefined categories
const CATEGORIES = [
  { value: "income", label: "Income" },
  { value: "food & dining", label: "Food & Dining" },
  { value: "housing", label: "Housing" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "entertainment", label: "Entertainment" },
  { value: "shopping", label: "Shopping" },
  { value: "travel", label: "Travel" },
  { value: "bills & utilities", label: "Bills & Utilities" },
  { value: "others", label: "Others" },
];

export default function TransactionForm({
  onSuccess,
  editingTransaction = null,
  onCancelEdit = () => {},
}) {
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    category: "others", // Default category
    date: new Date().toISOString().split("T")[0],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!editingTransaction;

  // Load transaction data when editing
  useEffect(() => {
    if (editingTransaction) {
      const formattedDate = new Date(editingTransaction.date)
        .toISOString()
        .split("T")[0];
      setFormData({
        amount: Math.abs(editingTransaction.amount).toString(),
        description: editingTransaction.description,
        category: editingTransaction.category || "others",
        date: formattedDate,
      });
    } else {
      resetForm();
    }
  }, [editingTransaction]);

  const resetForm = () => {
    setFormData({
      amount: "",
      description: "",
      category: "others",
      date: new Date().toISOString().split("T")[0],
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = "Amount must be a positive number";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Prepare data for API
      const data = {
        // Make amount negative for expenses, positive for income
        amount:
          formData.category === "income"
            ? Math.abs(Number(formData.amount))
            : -Math.abs(Number(formData.amount)),
        description: formData.description.trim(),
        category: formData.category,
        date: new Date(formData.date).toISOString(),
      };

      if (isEditing) {
        await updateTransaction(editingTransaction._id, data);
      } else {
        await addTransaction(data);
      }

      onSuccess();
      resetForm();
    } catch (error) {
      console.error("Error saving transaction:", error);
      setErrors({ submit: "Failed to save transaction. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditing ? "Edit Transaction" : "Add New Transaction"}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              name="amount"
              type="text"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={handleChange}
              className={errors.amount ? "border-red-500" : ""}
            />
            {errors.amount && (
              <p className="text-red-500 text-xs">{errors.amount}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              placeholder="Enter description"
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-red-500 text-xs">{errors.description}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          {errors.submit && (
            <p className="text-red-500 text-sm">{errors.submit}</p>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          {isEditing && (
            <Button type="button" variant="outline" onClick={onCancelEdit}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : isEditing
              ? "Update"
              : "Add Transaction"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
