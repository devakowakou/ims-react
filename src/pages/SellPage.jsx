
import React, { useState, useEffect } from "react";
import Layout from "../layout/Layout";
import ProductService from "../service/ProductService";
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
import TransactionService from "../service/TransactionService";

const SellPage = () => {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [description, setDescription] = useState("");
  const [note, setNote] = useState("");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState({ text: "", isError: false });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productData = await ProductService.getAllProducts();
        setProducts(productData.products);
      } catch (error) {
        showMessage(error.response?.data?.message || "Error fetching products", true);
      }
    };

    fetchProducts();
  }, []);

  const showMessage = (msg, isError = false) => {
    setMessage({ text: msg, isError });
    setTimeout(() => setMessage({ text: "", isError: false }), 4000);
  };

  const resetForm = () => {
    setProductId("");
    setDescription("");
    setNote("");
    setQuantity("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productId || !quantity) {
      showMessage("Please select a product and enter a quantity.", true);
      return;
    }

    const sellData = {
      productId,
      quantity: parseInt(quantity, 10),
      description,
      note,
      type: 'OUT'
    };

    try {
      const response = await TransactionService.sellProduct(sellData);
      showMessage(response.message || "Product sold successfully!");
      resetForm();
    } catch (error) {
      showMessage(error.response?.data?.message || "Error selling product", true);
    }
  };

  return (
    <Layout>
        <main className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
            <Card className="max-w-4xl mx-auto w-full">
                <CardHeader>
                    <CardTitle>Sell Product</CardTitle>
                    <CardDescription>Process customer sales and update inventory.</CardDescription>
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
                                <Label htmlFor="quantity">Quantity *</Label>
                                <Input id="quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required min="1" placeholder="e.g. 10"/>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. Sale to customer John Doe"/>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="note">Notes</Label>
                            <Textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Included a free sample" rows="3"/>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={resetForm}>Reset</Button>
                        <Button type="submit">Sell Product</Button>
                    </CardFooter>
                </form>
            </Card>
        </main>
    </Layout>
  );
};
export default SellPage;
