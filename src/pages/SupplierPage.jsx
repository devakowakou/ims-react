
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../layout/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "../component/ui/card";
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
  } from "../component/ui/alert-dialog";
import { Button } from "../component/ui/button";
import SupplierService from "../service/SupplierService";

const SupplierPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [message, setMessage] = useState({ text: "", isError: false });
  const navigate = useNavigate();

  const showMessage = (msg, isError = false) => {
    setMessage({ text: msg, isError });
    setTimeout(() => {
      setMessage({ text: "", isError: false });
    }, 4000);
  };

  const fetchSuppliers = async () => {
    try {
      const responseData = await SupplierService.getAllSuppliers();
      if (responseData.status === 200) {
        setSuppliers(responseData.suppliers);
      } else {
        showMessage(responseData.message, true);
      }
    } catch (error) {
      showMessage(error.response?.data?.message || "Error fetching suppliers", true);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleDeleteSupplier = async (supplierId) => {
    try {
        await SupplierService.deleteSupplier(supplierId);
        showMessage("Supplier deleted successfully");
        fetchSuppliers(); // Re-fetch suppliers after deletion
    } catch (error) {
      showMessage(error.response?.data?.message || "Error deleting supplier", true);
    }
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
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Suppliers</CardTitle>
                        <CardDescription>Manage your supplier network.</CardDescription>
                    </div>
                    <Button onClick={() => navigate("/add-supplier")}>Add New Supplier</Button>
                </CardHeader>
                <CardContent>
                    {suppliers && suppliers.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {suppliers.map((supplier) => (
                                <Card key={supplier.id}>
                                    <CardHeader>
                                        <CardTitle>{supplier.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">{supplier.contactInfo}</p>
                                        <p className="text-sm ">{supplier.address}</p>
                                    </CardContent>
                                    <CardFooter className="flex justify-end gap-2">
                                        <Button variant="outline" onClick={() => navigate(`/edit-supplier/${supplier.id}`)}>Edit</Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive">Delete</Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete the supplier.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDeleteSupplier(supplier.id)}>Delete</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-4 p-8 text-center border-2 border-dashed rounded-lg">
                            <div className="text-4xl">🏢</div>
                            <h3 className="text-xl font-semibold">No Suppliers Found</h3>
                            <p className="text-muted-foreground">Get started by adding your first supplier.</p>
                            <Button onClick={() => navigate("/add-supplier")}>Add Your First Supplier</Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </main>
    </Layout>
  );
};

export default SupplierPage;
