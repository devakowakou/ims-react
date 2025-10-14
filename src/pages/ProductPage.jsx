import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ProductService from "../service/ProductService";
import { useNavigate } from "react-router-dom";
import PaginationComponent from "../component/PaginationComponent";
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
import { Badge } from "@/components/ui/badge";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // Pagination Set-Up
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 6;

  useEffect(() => {
    const getProducts = async () => {
      try {
        const productData = await ProductService.getAllProducts();

        if (productData.status === 200) {
          setTotalPages(Math.ceil(productData.products.length / itemsPerPage));

          setProducts(
            productData.products.slice(
              (currentPage - 1) * itemsPerPage,
              currentPage * itemsPerPage
            )
          );
        }
      } catch (error) {
        showMessage(
          error.response?.data?.message || "Error Getting Products: " + error
        );
      }
    };

    getProducts();
  }, [currentPage]);

  // Delete a product
  const handleDeleteProduct = async (productId) => {
      try {
        await ProductService.deleteProduct(productId);
        showMessage("Product successfully Deleted");
        window.location.reload(); // reload page
      } catch (error) {
        showMessage(
          error.response?.data?.message ||
            "Error Deleting a product: " + error
        );
      }
  };

  // Method to show message or errors
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
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Products</CardTitle>
                        <CardDescription>Manage your product inventory with ease</CardDescription>
                    </div>
                    <Button onClick={() => navigate("/add-product")}>Add New Product</Button>
                </CardHeader>
                <CardContent>
                {products && products.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {products.map((product) => (
                            <Card key={product.id}>
                                <CardHeader>
                                    <div className="relative">
                                        <img
                                            className="object-cover w-full h-48 rounded-lg"
                                            src={product.imageUrl || '/default-product.png'}
                                            alt={product.name}
                                            onError={(e) => {
                                                e.target.src = '/default-product.png';
                                            }}
                                        />
                                        <Badge className="absolute top-2 right-2" variant={product.stockQuantity > 0 ? 'success' : 'destructive'}>
                                            {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <h3 className="text-lg font-bold">{product.name}</h3>
                                    <div className="flex justify-between">
                                        <p className="text-sm text-gray-500">{product.sku}</p>
                                        <p className="text-lg font-semibold">${product.price}</p>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => navigate(`/edit-product/${product.id}`)}>Edit</Button>
                                    <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive">Delete</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete the product.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDeleteProduct(product.id)}>Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-4 p-8">
                            <div className="text-4xl">📦</div>
                            <h3 className="text-xl font-semibold">No Products Found</h3>
                            <p>Get started by adding your first product</p>
                            <Button onClick={() => navigate("/add-product")}>Add Your First Product</Button>
                        </div>
                    )}
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
export default ProductPage;
