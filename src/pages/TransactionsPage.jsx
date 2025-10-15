
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../layout/Layout";
import PaginationComponent from "../component/PaginationComponent"; 
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../component/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../component/ui/table";
import { Badge } from "../component/ui/badge";
import { Input } from "../component/ui/input";
import { Button } from "../component/ui/button";
import TransactionService from "../service/TransactionService";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState({ text: "", isError: false });
  const [filter, setFilter] = useState("");
  const [valueToSearch, setValueToSearch] = useState("");

  const navigate = useNavigate();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;

  const showMessage = (msg, isError = false) => {
    setMessage({ text: msg, isError });
    setTimeout(() => setMessage({ text: "", isError: false }), 4000);
  };

  useEffect(() => {
    const getTransactions = async () => {
      try {
        const transactionData = await TransactionService.getAllTransactions(valueToSearch);
        if (transactionData.status === 200) {
          const allTransactions = transactionData.transactions;
          setTotalPages(Math.ceil(allTransactions.length / itemsPerPage));
          setTransactions(
            allTransactions.slice(
              (currentPage - 1) * itemsPerPage,
              currentPage * itemsPerPage
            )
          );
        }
      } catch (error) {
        showMessage(error.response?.data?.message || "Error fetching transactions", true);
      }
    };

    getTransactions();
  }, [currentPage, valueToSearch]);

  const handleSearch = () => {
    setCurrentPage(1);
    setValueToSearch(filter);
  };

  return (
    <Layout>
        <main className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
            {message.text && 
              <div className={`p-4 mb-4 text-sm rounded-lg ${message.isError ? 'text-destructive-foreground bg-destructive' : 'text-primary-foreground bg-primary'}`}>
                {message.text}
              </div>
            }
            <Card>
                <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>A detailed record of all inventory movements.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 mb-4">
                        <Input
                            placeholder="Search by product name, SKU, or type..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="max-w-sm"
                        />
                        <Button onClick={handleSearch}>Search</Button>
                    </div>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Total Price</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.length > 0 ? transactions.map((transaction) => (
                                <TableRow key={transaction.id}>
                                    <TableCell>
                                        <Badge variant={transaction.type === 'IN' ? 'secondary' : 'default'}>
                                            {transaction.type === 'IN' ? 'Purchase' : 'Sale'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{transaction.productName}</TableCell>
                                    <TableCell>{transaction.quantity}</TableCell>
                                    <TableCell>${transaction.totalPrice.toFixed(2)}</TableCell>
                                    <TableCell>{new Date(transaction.transactionDate).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Button variant="outline" size="sm" onClick={() => navigate(`/transaction/${transaction.id}`)}>
                                            View Details
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan="6" className="text-center">No transactions found.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
            {totalPages > 1 && 
                <PaginationComponent
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            }
        </main>
    </Layout>
  );
};
export default TransactionsPage;
