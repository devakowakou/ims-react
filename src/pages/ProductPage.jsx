import React, { useState, useEffect } from "react";
import Layout from "../components/component/Layout";
import ProductService from "../service/ProductService";
import { useNavigate } from "react-router-dom";
import PaginationComponent from "../components/component/PaginationComponent";
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
            <Card className="bg-white border shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-gray-900">Products</CardTitle>
                        <CardDescription className="text-gray-500">Manage your product inventory with ease</CardDescription>
                    </div>
                    <Button onClick={() => navigate("/add-product")} className="bg-blue-600 hover:bg-blue-700 text-white">Add New Product</Button>
                </CardHeader>
                <CardContent>
                {products && products.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {products.map((product) => (
                            <Card key={product.id} className="bg-white border rounded-lg shadow-sm">
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
                                        <Badge className={`absolute top-2 right-2 ${product.stockQuantity > 0 ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                                            {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                                    <div className="flex justify-between">
                                        <p className="text-sm text-gray-500">{product.sku}</p>
                                        <p className="text-lg font-semibold text-gray-800">${product.price}</p>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => navigate(`/edit-product/${product.id}`)}>Edit</Button>
                                    <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive">Delete</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="bg-white">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className="text-gray-900">Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription className="text-gray-600">
                                                This action cannot be undone. This will permanently delete the product.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDeleteProduct(product.id)} className="bg-red-600 hover:bg-red-700 text-white">Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
                            <div className="text-4xl">📦</div>
                            <h3 className="text-xl font-semibold text-gray-900">No Products Found</h3>
                            <p className="text-gray-500">Get started by adding your first product</p>
                            <Button onClick={() => navigate("/add-product")} className="bg-blue-600 hover:bg-blue-700 text-white">Add Your First Product</Button>
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
