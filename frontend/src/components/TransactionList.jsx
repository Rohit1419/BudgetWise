import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreHorizontal, Edit, Trash } from "lucide-react";
import { deleteTransaction } from "@/services/transactionService";
import { format } from "date-fns";

export default function TransactionList({
  transactions,
  isLoading,
  onEdit,
  onTransactionChange,
}) {
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });
  const [deletingId, setDeletingId] = useState(null);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            Loading transactions...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            No transactions found. Add one to get started!
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (sortConfig.key === "date") {
      return sortConfig.direction === "asc"
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    }

    if (sortConfig.key === "amount") {
      return sortConfig.direction === "asc"
        ? a.amount - b.amount
        : b.amount - a.amount;
    }

    return 0;
  });

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      setDeletingId(id);
      try {
        await deleteTransaction(id);
        onTransactionChange();
      } catch (error) {
        console.error("Failed to delete transaction:", error);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Math.abs(amount));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("date")}
                >
                  Date{" "}
                  {sortConfig.key === "date" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead>Description</TableHead>
                <TableHead
                  className="text-right cursor-pointer"
                  onClick={() => handleSort("amount")}
                >
                  Amount{" "}
                  {sortConfig.key === "amount" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTransactions.map((transaction) => (
                <TableRow key={transaction._id}>
                  <TableCell className="font-medium">
                    {format(new Date(transaction.date), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className="text-right font-medium text-red-600">
                    {formatAmount(transaction.amount)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(transaction)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => handleDelete(transaction._id)}
                          disabled={deletingId === transaction._id}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          {deletingId === transaction._id
                            ? "Deleting..."
                            : "Delete"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
