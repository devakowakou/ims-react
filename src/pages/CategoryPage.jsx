import React, { useEffect, useState } from "react";
import Layout from "../components/component/Layout";
import ApiService from "../service/ApiService";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [message, setMessage] = useState("");

  // Fetch the categories from our backend
  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await ApiService.getAllCategory();
        if (response.status === 200) {
          setCategories(response.categories);
        }
      } catch (error) {
        showMessage(
          error.response?.data?.message || "Error fetching categories: " + error
        );
      }
    };
    getCategories();
  }, []);

  // Add category
  const addCategory = async () => {
    if (!categoryName) {
      showMessage("Category name cannot be empty");
      return;
    }
    try {
      await ApiService.createCategory({ name: categoryName });
      showMessage("Category successfully added");
      setCategoryName(""); // Clear input
      window.location.reload(); // Reload page
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error adding category: " + error
      );
    }
  };

  // Edit category
  const editCategory = async (categoryId) => {
    try {
      await ApiService.updateCategory(categoryId, {
        name: categoryName,
      });
      showMessage("Category successfully updated");
      setCategoryName(""); // Clear input
      window.location.reload(); // Reload page
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error updating category: " + error
      );
    }
  };

  // Delete category
  const handleDeleteCategory = async (categoryId) => {
      try {
        await ApiService.deleteCategory(categoryId);
        showMessage("Category successfully deleted");
        window.location.reload(); // Reload page
      } catch (error) {
        showMessage(
          error.response?.data?.message || "Error deleting category: " + error
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
                        <CardTitle className="text-gray-900">Categories</CardTitle>
                        <CardDescription className="text-gray-500">Manage your product categories</CardDescription>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Add Category</Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white">
                            <DialogHeader>
                                <DialogTitle>Add New Category</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <Input
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                    placeholder="Category Name"
                                />
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button onClick={addCategory} className="bg-blue-600 hover:bg-blue-700 text-white">Add</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    <ul className="grid gap-4">
                        {categories.map((category) => (
                            <li key={category.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg bg-gray-50">
                                <div className="font-medium text-gray-900 mb-2 sm:mb-0">{category.name}</div>
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" onClick={() => setCategoryName(category.name)}>Edit</Button>
                                    </DialogTrigger>
                                    <DialogContent className="bg-white">
                                        <DialogHeader>
                                            <DialogTitle>Edit Category</DialogTitle>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <Input
                                                value={categoryName}
                                                onChange={(e) => setCategoryName(e.target.value)}
                                                placeholder="Category Name"
                                            />
                                        </div>
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button variant="outline">Cancel</Button>
                                            </DialogClose>
                                            <Button onClick={() => editCategory(category.id)} className="bg-blue-600 hover:bg-blue-700 text-white">Save Changes</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive">Delete</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="bg-white">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete the category.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDeleteCategory(category.id)} className="bg-red-600 hover:bg-red-700 text-white">Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                                </div>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </main>
    </Layout>
  );
};

export default CategoryPage;
