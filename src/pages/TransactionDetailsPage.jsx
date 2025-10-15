
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../layout/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "../component/ui/card";
import { Button } from "../component/ui/button";
import { Badge } from "../component/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../component/ui/select";
import TransactionService from "../service/TransactionService";

const TransactionDetailsPage = () => {
  const { transactionId } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [message, setMessage] = useState({ text: "", isError: false });
  const [status, setStatus] = useState("");

  const navigate = useNavigate();

  const fetchTransaction = async () => {
    try {
      const transactionData = await TransactionService.getTransactionById(transactionId);
      if (transactionData.status === 200) {
        setTransaction(transactionData.transaction);
        setStatus(transactionData.transaction.status);
      } else {
        showMessage(transactionData.message, true);
      }
    } catch (error) {
      showMessage(error.response?.data?.message || "Error fetching transaction details", true);
    }
  };

  useEffect(() => {
    fetchTransaction();
  }, [transactionId]);

  const handleUpdateStatus = async () => {
    try {
      await TransactionService.updateTransactionStatus(transactionId, { status });
      showMessage("Transaction status updated successfully!");
      fetchTransaction(); 
    } catch (error) {
      showMessage(error.response?.data?.message || "Error updating transaction status", true);
    }
  };

  const showMessage = (msg, isError = false) => {
    setMessage({ text: msg, isError });
    setTimeout(() => setMessage({ text: "", isError: false }), 4000);
  };

  if (!transaction) {
    return <Layout><main className="flex flex-col gap-4 p-4 md:gap-8 md:p-8"><p>Loading transaction details...</p></main></Layout>;
  }

  const { product, user, supplier } = transaction;

  return (
    <Layout>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 md:gap-8">
            {message.text && 
              <div className={`p-4 mb-4 text-sm rounded-lg ${message.isError ? 'text-destructive-foreground bg-destructive' : 'text-primary-foreground bg-primary'}`}>
                {message.text}
              </div>
            }
            <div className="grid auto-rows-max gap-4 md:grid-cols-3">
                <div className="md:col-span-2 grid gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle>Transaction Details</CardTitle>
                          <Badge variant={transaction.type === 'IN' ? 'secondary' : 'default'}>
                            {transaction.type === 'IN' ? 'Purchase' : 'Sale'}
                          </Badge>
                        </CardHeader>
                        <CardContent>
                          <div className="text-sm text-muted-foreground">Transaction ID: {transaction.id}</div>
                          <div className="text-sm">Date: {new Date(transaction.transactionDate).toLocaleString()}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Product Information</CardTitle></CardHeader>
                        <CardContent>
                            <div className="grid gap-2">
                                <div><strong>Name:</strong> {product.name}</div>
                                <div><strong>SKU:</strong> {product.sku}</div>
                                <div><strong>Price:</strong> ${product.price.toFixed(2)}</div>
                                <p><strong>Description:</strong> {product.description}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid auto-rows-max gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Status</CardTitle>
                            <CardDescription>Current status of the transaction.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                               <Select value={status} onValueChange={setStatus}>
                                   <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                                   <SelectContent>
                                       <SelectItem value="PENDING">Pending</SelectItem>
                                       <SelectItem value="PROCESSING">Processing</SelectItem>
                                       <SelectItem value="COMPLETED">Completed</SelectItem>
                                       <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                   </SelectContent>
                               </Select>
                               <Button onClick={handleUpdateStatus}>Update Status</Button>
                            </div>
                        </CardContent>
                    </Card>
                    {supplier && (
                        <Card>
                            <CardHeader><CardTitle>Supplier Information</CardTitle></CardHeader>
                            <CardContent>
                                <div className="grid gap-2">
                                    <div><strong>Name:</strong> {supplier.name}</div>
                                    <div><strong>Contact:</strong> {supplier.contactInfo}</div>
                                    <p><strong>Address:</strong> {supplier.address}</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                    <Card>
                        <CardHeader><CardTitle>User Information</CardTitle></CardHeader>
                        <CardContent>
                            <div className="grid gap-2">
                                <div><strong>Name:</strong> {user.name}</div>
                                <div><strong>Email:</strong> {user.email}</div>
                            </div>
                        </CardContent>
                    </Card>
                    <CardFooter>
                        <Button variant="outline" onClick={() => navigate(-1)} className="w-full">Go Back</Button>
                    </CardFooter>
                </div>
            </div>
        </main>
    </Layout>
  );
};

export default TransactionDetailsPage;
