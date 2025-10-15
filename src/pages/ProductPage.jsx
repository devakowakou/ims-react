
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../layout/Layout";
import PaginationComponent from "../component/PaginationComponent"; 
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
import { Badge } from "../component/ui/badge";
import ProductService from "../service/ProductService";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 6;

  const showMessage = (msg, isError = false) => {
    setMessage({ text: msg, isError });
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  const fetchProducts = async () => {
    try {
      const productData = await ProductService.getAllProducts();
      if (productData.status === 200) {
        const allProducts = productData.products;
        setTotalPages(Math.ceil(allProducts.length / itemsPerPage));
        setProducts(
          allProducts.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
          )
        );
      }
    } catch (error) {
      showMessage(error.response?.data?.message || "Error fetching products", true);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const handleDeleteProduct = async (productId) => {
      try {
        await ProductService.deleteProduct(productId);
        showMessage("Product successfully deleted");
        fetchProducts(); // Refetch products after deletion
      } catch (error) {
        showMessage(error.response?.data?.message || "Error deleting product", true);
      }
  };

  return (
    <Layout>
        <main className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
            {message && 
              <div className={`p-4 mb-4 text-sm rounded-lg ${message.isError ? 'text-red-700 bg-red-100' : 'text-green-700 bg-green-100'}`}>
                {message.text}
              </div>
            }
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Products</CardTitle>
                        <CardDescription>Manage your product inventory with ease.</CardDescription>
                    </div>
                    <Button onClick={() => navigate("/add-product")}>Add New Product</Button>
                </CardHeader>
                <CardContent>
                {products && products.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {products.map((product) => (
                            <Card key={product.id}>
                                <CardHeader className="p-0">
                                    <img
                                        className="object-cover w-full h-48 rounded-t-lg"
                                        src={product.imageUrl || '/default-product.png'}
                                        alt={product.name}
                                        onError={(e) => { e.target.src = '/default-product.png'; }}
                                    />
                                </CardHeader>
                                <CardContent className="p-4">
                                    <Badge variant={product.stock > 0 ? 'default' : 'destructive'}>
                                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                    </Badge>
                                    <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
                                    <div className="flex items-center justify-between mt-2">
                                        <p className="text-sm text-muted-foreground">{product.sku}</p>
                                        <p className="text-lg font-bold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price)}</p>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-end gap-2 p-4">
                                    <Button variant="outline" onClick={() => navigate(`/edit-product/${product.id}`)}>Edit</Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive">Delete</Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete the product.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDeleteProduct(product.id)}>Continue</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-4 p-8 text-center border-2 border-dashed rounded-lg">
                            <div className="text-4xl">📦</div>
                            <h3 className="text-xl font-semibold">No Products Found</h3>
                            <p className="text-muted-foreground">Get started by adding your first product.</p>
                            <Button onClick={() => navigate("/add-product")}>Add Your First Product</Button>
                        </div>
                    )}
                </CardContent>
            </Card>
            {totalPages > 1 && 
                <PaginationComponent
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            }
        </main>
    </Layout>
  );
};
export default ProductPage;
