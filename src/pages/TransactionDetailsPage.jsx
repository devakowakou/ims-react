import React, { useState, useEffect } from "react";
import Layout from "../components/component/Layout";
import ApiService from "../service/ApiService";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TransactionDetailsPage = () => {
  const { transactionId } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const getTransaction = async () => {
      try {
        const transactionData = await ApiService.getTransactionById(transactionId);

        if (transactionData.status === 200) {
          setTransaction(transactionData.transaction);
          setStatus(transactionData.transaction.status);
        }
      } catch (error) {
        showMessage(
          error.response?.data?.message ||
            "Error Getting a transaction: " + error
        );
      }
    };

    getTransaction();
  }, [transactionId]);

  //update transaction status
  const handleUpdateStatus = async () => {
    try {
      ApiService.updateTransactionStatus(transactionId, status);
      navigate("/transaction");
    } catch (error) {
      showMessage(
        error.response?.data?.message ||
          "Error Updating a transactions: " + error
      );
    }
  };

  //Method to show message or errors
  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  return (
    <Layout>
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <div className="grid auto-rows-max flex-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {transaction && (
            <>
              <div className="grid gap-4 md:col-span-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Transaction Information</CardTitle>
                        <CardDescription>{transaction.description}</CardDescription>
                    </div>
                    <Badge variant={transaction.status === 'COMPLETED' ? 'success' : 'warning'}>{transaction.status}</Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex items-center gap-2">
                            <p className="font-medium">Type:</p>
                            <p>{transaction.transactionType}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="font-medium">Note:</p>
                            <p>{transaction.note}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="font-medium">Total Products:</p>
                            <p>{transaction.totalProducts}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="font-medium">Total Price:</p>
                            <p>${transaction.totalPrice.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="font-medium">Created At:</p>
                            <p>{new Date(transaction.createdAt).toLocaleString()}</p>
                        </div>
                        {transaction.updatedAt && (
                            <div className="flex items-center gap-2">
                                <p className="font-medium">Updated At:</p>
                                <p>{new Date(transaction.updatedAt).toLocaleString()}</p>
                            </div>
                        )}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Product Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="flex items-center gap-2">
                                <p className="font-medium">Name:</p>
                                <p>{transaction.product.name}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <p className="font-medium">SKU:</p>
                                <p>{transaction.product.sku}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <p className="font-medium">Price:</p>
                                <p>${transaction.product.price.toFixed(2)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <p className="font-medium">Stock Quantity:</p>
                                <p>{transaction.product.stockQuantity}</p>
                            </div>
                            <div className="col-span-2 flex items-center gap-2">
                                <p className="font-medium">Description:</p>
                                <p>{transaction.product.description}</p>
                            </div>
                        </div>
                        {transaction.product.imageUrl && (
                            <div className="mt-4">
                                <img 
                                    src={transaction.product.imageUrl} 
                                    alt={transaction.product.name} 
                                    className="rounded-lg object-cover w-full h-auto"
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>
              </div>
              <div className="grid gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>User Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            <div className="flex items-center gap-2">
                                <p className="font-medium">Name:</p>
                                <p>{transaction.user.name}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <p className="font-medium">Email:</p>
                                <p>{transaction.user.email}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <p className="font-medium">Phone Number:</p>
                                <p>{transaction.user.phoneNumber}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <p className="font-medium">Role:</p>
                                <Badge>{transaction.user.role}</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                {transaction.supplier && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Supplier Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                                <div className="flex items-center gap-2">
                                    <p className="font-medium">Name:</p>
                                    <p>{transaction.supplier.name}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <p className="font-medium">Contact Info:</p>
                                    <p>{transaction.supplier.contactInfo}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <p className="font-medium">Address:</p>
                                    <p>{transaction.supplier.address}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
                <Card>
                    <CardHeader>
                        <CardTitle>Update Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PENDING">PENDING</SelectItem>
                                    <SelectItem value="PROCESSING">PROCESSING</SelectItem>
                                    <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                                    <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button onClick={handleUpdateStatus}>Update Status</Button>
                        </div>
                    </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </main>
    </Layout>
  );
};

export default TransactionDetailsPage;
