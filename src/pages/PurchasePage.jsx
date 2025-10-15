import React, { useState, useEffect } from "react";
import Layout from "../components/component/Layout";
import ApiService from "../service/ApiService";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PurchasePage = () => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [productId, setProductId] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [description, setDescription] = useState("");
  const [note, setNote] = useState("");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProductsAndSuppliers = async () => {
      try {
        const productData = await ApiService.getAllProducts();
        const supplierData = await ApiService.getAllSuppliers();
        setProducts(productData.products);
        setSuppliers(supplierData.suppliers);
      } catch (error) {
        showMessage(
          error.response?.data?.message || "Error fetching data: " + error
        );
      }
    };

    fetchProductsAndSuppliers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productId || !supplierId || !quantity) {
      showMessage("Please fill in all required fields");
      return;
    }
    const body = {
      productId,
      quantity: parseInt(quantity),
      supplierId,
      description,
      note,
    };

    try {
      const response = await ApiService.purchaseProduct(body);
      showMessage(response.message);
      resetForm();
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error purchasing products: " + error
      );
    }
  };

  const resetForm = () => {
    setProductId("");
    setSupplierId("");
    setDescription("");
    setNote("");
    setQuantity("");
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  return (
    <Layout>
        <main className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
            {message && <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{message}</div>}
            <Card className="bg-white border shadow-sm">
                <CardHeader>
                    <CardTitle className="text-gray-900">Receive Inventory</CardTitle>
                    <CardDescription className="text-gray-500">Add new stock to your inventory from suppliers</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="product">Select Product *</Label>
                            <Select value={productId} onValueChange={setProductId} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose a product" />
                                </SelectTrigger>
                                <SelectContent>
                                    {products.map((product) => (
                                        <SelectItem key={product.id} value={product.id}>
                                        {product.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="supplier">Select Supplier *</Label>
                            <Select value={supplierId} onValueChange={setSupplierId} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose a supplier" />
                                </SelectTrigger>
                                <SelectContent>
                                    {suppliers.map((supplier) => (
                                        <SelectItem key={supplier.id} value={supplier.id}>
                                        {supplier.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="quantity">Quantity *</Label>
                            <Input
                                id="quantity"
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                required
                                placeholder="Enter quantity"
                                min="1"
                            />
                        </div>
                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter product description"
                            />
                        </div>
                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="note">Notes</Label>
                            <Textarea
                                id="note"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Additional notes or comments"
                                rows="3"
                            />
                        </div>
                        <CardFooter className="md:col-span-2 flex flex-col sm:flex-row sm:justify-end gap-2">
                            <Button type="button" variant="outline" onClick={resetForm}>Reset Form</Button>
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Receive Inventory</Button>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
        </main>
    </Layout>
  );
};
export default PurchasePage;
