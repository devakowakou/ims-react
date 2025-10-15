
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
import CategoryService from "../service/CategoryService";
import ProductService from "../service/ProductService";

const AddEditProductPage = () => {
  const { productId } = useParams();
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState(""); // Renamed for consistency
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState({ text: "", isError: false });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await CategoryService.getAllCategory();
        setCategories(categoriesData.categories);
      } catch (error) {
        showMessage(error.response?.data?.message || "Error fetching categories", true);
      }
    };

    const fetchProductById = async () => {
      try {
        const productData = await ProductService.getProductById(productId);
        if (productData.status === 200) {
          const { product } = productData;
          setName(product.name);
          setSku(product.sku);
          setPrice(product.price);
          setStock(product.stock);
          setCategoryId(product.categoryId);
          setDescription(product.description);
          setImageUrl(product.imageUrl);
        } else {
          showMessage(productData.message, true);
        }
      } catch (error) {
        showMessage(error.response?.data?.message || "Error fetching product details", true);
      }
    };

    fetchCategories();
    if (productId) {
      setIsEditing(true);
      fetchProductById();
    }
  }, [productId]);

  const showMessage = (msg, isError = false) => {
    setMessage({ text: msg, isError });
    setTimeout(() => setMessage({ text: "", isError: false }), 4000);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImageUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("sku", sku);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("categoryId", categoryId);
    formData.append("description", description);
    if (imageFile) {
      formData.append("imageFile", imageFile);
    }

    try {
      if (isEditing) {
        await ProductService.updateProduct(productId, formData);
        showMessage("Product updated successfully");
      } else {
        await ProductService.addProduct(formData);
        showMessage("Product added successfully");
      }
      setTimeout(() => navigate("/product"), 1500);
    } catch (error) {
      showMessage(error.response?.data?.message || "Error saving product", true);
    }
  };

  return (
    <Layout>
      <main className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? "Edit Product" : "Add New Product"}</CardTitle>
            <CardDescription>{isEditing ? "Update your product details." : "Fill in the form to add a new product."}</CardDescription>
            {message.text && 
              <p className={`mt-2 text-sm ${message.isError ? 'text-destructive' : 'text-primary'}`}>
                {message.text}
              </p>
            }
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                      <Label htmlFor="name">Product Name</Label>
                      <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                  <div className="grid gap-2">
                      <Label htmlFor="sku">SKU</Label>
                      <Input id="sku" value={sku} onChange={(e) => setSku(e.target.value)} required />
                  </div>
                  <div className="grid gap-2">
                      <Label htmlFor="stock">Stock Quantity</Label>
                      <Input id="stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
                  </div>
                  <div className="grid gap-2">
                      <Label htmlFor="price">Price</Label>
                      <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required step="0.01" />
                  </div>
              </div>
              <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="5" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select onValueChange={setCategoryId} value={categoryId} required>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id.toString()}>
                                {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="image">Product Image</Label>
                    <Input id="image" type="file" onChange={handleImageChange} accept="image/*" />
                </div>
              </div>
              {imageUrl && (
                <div className="mt-4">
                    <Label>Image Preview</Label>
                    <img src={imageUrl} alt="Preview" className="rounded-lg object-cover w-full h-auto max-h-64 border" />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit">{isEditing ? "Update Product" : "Save Product"}</Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </Layout>
  );
};

export default AddEditProductPage;
