
import React, { useState, useEffect } from "react";
import Layout from "../layout/Layout"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "../component/ui/card";
import { Button } from "../component/ui/button";
import { Input } from "../component/ui/input";
import { Label } from "../component/ui/label";
import { Textarea } from "../component/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../component/ui/select";
import ProductService from "../service/ProductService";
import SupplierService from "../service/SupplierService";
import TransactionService from "../service/TransactionService";

const PurchasePage = () => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [productId, setProductId] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [description, setDescription] = useState("");
  const [note, setNote] = useState("");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState({ text: "", isError: false });

  useEffect(() => {
    const fetchProductsAndSuppliers = async () => {
      try {
        const productData = await ProductService.getAllProducts();
        const supplierData = await SupplierService.getAllSuppliers();
        setProducts(productData.products);
        setSuppliers(supplierData.suppliers);
      } catch (error) {
        showMessage(error.response?.data?.message || "Error fetching data", true);
      }
    };

    fetchProductsAndSuppliers();
  }, []);

  const showMessage = (msg, isError = false) => {
    setMessage({ text: msg, isError });
    setTimeout(() => setMessage({ text: "", isError: false }), 4000);
  };

  const resetForm = () => {
    setProductId("");
    setSupplierId("");
    setDescription("");
    setNote("");
    setQuantity("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productId || !supplierId || !quantity) {
      showMessage("Please fill in all required fields.", true);
      return;
    }
    
    const purchaseData = {
      productId,
      quantity: parseInt(quantity, 10),
      supplierId,
      description,
      note,
    };

    try {
      const response = await TransactionService.purchaseProduct(purchaseData);
      showMessage(response.message || "Inventory received successfully!");
      resetForm();
    } catch (error) {
      showMessage(error.response?.data?.message || "Error receiving inventory", true);
    }
  };

  return (
    <Layout>
        <main className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
            <Card className="max-w-4xl mx-auto w-full">
                <CardHeader>
                    <CardTitle>Receive Inventory</CardTitle>
                    <CardDescription>Add new stock to your inventory from suppliers.</CardDescription>
                    {message.text && 
                      <p className={`mt-2 text-sm ${message.isError ? 'text-destructive' : 'text-primary'}`}>
                        {message.text}
                      </p>
                    }
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="grid gap-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="product">Select Product *</Label>
                                <Select value={productId} onValueChange={setProductId} required>
                                    <SelectTrigger><SelectValue placeholder="Choose a product" /></SelectTrigger>
                                    <SelectContent>
                                        {products.map((product) => (
                                            <SelectItem key={product.id} value={product.id.toString()}>{product.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="supplier">Select Supplier *</Label>
                                <Select value={supplierId} onValueChange={setSupplierId} required>
                                    <SelectTrigger><SelectValue placeholder="Choose a supplier" /></SelectTrigger>
                                    <SelectContent>
                                        {suppliers.map((supplier) => (
                                            <SelectItem key={supplier.id} value={supplier.id.toString()}>{supplier.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="quantity">Quantity *</Label>
                            <Input id="quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required min="1" placeholder="e.g. 100"/>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. Received new shipment of T-shirts"/>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="note">Notes</Label>
                            <Textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. All items in good condition" rows="3"/>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={resetForm}>Reset</Button>
                        <Button type="submit">Receive Inventory</Button>
                    </CardFooter>
                </form>
            </Card>
        </main>
    </Layout>
  );
};
export default PurchasePage;
