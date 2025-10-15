import React, { useState, useEffect } from "react";
import Layout from "../components/component/Layout";
import ApiService from "../service/ApiService";
import { useNavigate } from "react-router-dom";
import PaginationComponent from "../components/component/PaginationComponent";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("");
  const [valueToSearch, setValueToSearch] = useState("");

  const navigate = useNavigate();

  //Pagination Set-Up
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const getTransactions = async () => {
      try {
        const transactionData = await ApiService.getAllTransactions(valueToSearch);

        if (transactionData.status === 200) {
          setTotalPages(
            Math.ceil(transactionData.transactions.length / itemsPerPage)
          );

          setTransactions(
            transactionData.transactions.slice(
              (currentPage - 1) * itemsPerPage,
              currentPage * itemsPerPage
            )
          );
        }
      } catch (error) {
        showMessage(
          error.response?.data?.message || "Error Getting transactions: " + error
        );
      }
    };

    getTransactions();
  }, [currentPage, valueToSearch]);

  //Method to show message or errors
  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  //handle search
  const handleSearch = () => {
    setCurrentPage(1);
    setValueToSearch(filter);
  };

  //Navigate to transactions details page
  const navigateToTransactionDetailsPage = (transactionId) => {
    navigate(`/transaction/${transactionId}`);
  };

  return (
    <Layout>
        <main className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
            <Card className="bg-white border shadow-sm">
                <CardHeader>
                    <CardTitle className="text-gray-900">Transaction History</CardTitle>
                    <CardDescription className="text-gray-500">Manage and monitor all your transactions</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 mb-4">
                        <Input
                            placeholder="Search transactions..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="max-w-sm"
                        />
                        <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700 text-white">Search</Button>
                    </div>
                    <div className="responsive-table">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Total Price</TableHead>
                                <TableHead>Total Products</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.map((transaction) => (
                                <TableRow key={transaction.id}>
                                    <TableCell data-label="Type">
                                        <Badge variant={transaction.transactionType === 'PURCHASE' ? 'secondary' : 'default'}>
                                            {transaction.transactionType}
                                        </Badge>
                                    </TableCell>
                                    <TableCell data-label="Status">
                                    <Badge variant={transaction.status === 'COMPLETED' ? 'success' : 'warning'}>
                                            {transaction.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell data-label="Total Price" className="text-gray-800">${transaction.totalPrice}</TableCell>
                                    <TableCell data-label="Total Products" className="text-gray-800">{transaction.totalProducts}</TableCell>
                                    <TableCell data-label="Date" className="text-gray-800">
                                    {new Date(transaction.createdAt).toLocaleString()}
                                    </TableCell>
                                    <TableCell data-label="Actions">
                                    <Button
                                        onClick={() =>
                                        navigateToTransactionDetailsPage(transaction.id)
                                        }
                                        className="bg-blue-500 hover:bg-blue-600 text-white"
                                    >
                                        View Details
                                    </Button>
                                    </TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
            <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </main>
    </Layout>
  );
};
export default TransactionsPage;
