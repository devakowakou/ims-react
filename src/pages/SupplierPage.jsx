import React, { useState, useEffect } from "react";
import Layout from "../components/component/Layout";
import ApiService from "../service/ApiService";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";

const SupplierPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // fetch all suppliers
    const getSuppliers = async () => {
      try {
        const responseData = await ApiService.getAllSuppliers();
        if (responseData.status === 200) {
          setSuppliers(responseData.suppliers);
        } else {
          showMessage(responseData.message);
        }
      } catch (error) {
        showMessage(
          error.response?.data?.message || "Error Getting Suppliers: " + error
        );
        console.log(error);
      }
    };
    getSuppliers();
  }, []);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  // Delete Supplier
  const handleDeleteSupplier = async (supplierId) => {
    try {
        await ApiService.deleteSupplier(supplierId);
        window.location.reload();
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error Deleting a Suppliers: " + error
      );
    }
  };

  return (
    <Layout>
        <main className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
            {message && <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{message}</div>}
            <Card className="bg-white border shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-gray-900">Suppliers</CardTitle>
                        <CardDescription className="text-gray-500">Manage your supplier network</CardDescription>
                    </div>
                    <Button onClick={() => navigate("/add-supplier")} className="bg-blue-600 hover:bg-blue-700 text-white">Add Supplier</Button>
                </CardHeader>
                <CardContent>
                    {suppliers && suppliers.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {suppliers.map((supplier) => (
                                <Card key={supplier.id} className="bg-white border rounded-lg shadow-sm">
                                    <CardHeader>
                                        <CardTitle className="text-gray-900">{supplier.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-gray-500">{supplier.contactInfo}</p>
                                        <p className="text-sm text-gray-800">{supplier.address}</p>
                                    </CardContent>
                                    <CardFooter className="flex justify-end gap-2">
                                        <Button variant="outline" onClick={() => navigate(`/edit-supplier/${supplier.id}`)}>Edit</Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive">Delete</Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="bg-white">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete the supplier.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDeleteSupplier(supplier.id)} className="bg-red-600 hover:bg-red-700 text-white">Delete</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
                            <div className="text-4xl">🏢</div>
                            <h3 className="text-xl font-semibold text-gray-900">No Suppliers Found</h3>
                            <p className="text-gray-500">Start by adding your first supplier</p>
                            <Button onClick={() => navigate("/add-supplier")} className="bg-blue-600 hover:bg-blue-700 text-white">Add Your First Supplier</Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </main>
    </Layout>
  );
};

export default SupplierPage;
