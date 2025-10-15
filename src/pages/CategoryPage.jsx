
import React, { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../component/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "../component/ui/dialog";
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
import { Input } from "../component/ui/input";
import { Label } from "../component/ui/label";
import CategoryService from "../service/CategoryService";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState({ id: null, name: "" });
  const [message, setMessage] = useState({ text: "", isError: false });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const showMessage = (msg, isError = false) => {
    setMessage({ text: msg, isError });
    setTimeout(() => setMessage({ text: "", isError: false }), 4000);
  };

  const fetchCategories = async () => {
    try {
      const response = await CategoryService.getAllCategory();
      if (response.status === 200) {
        setCategories(response.categories);
      }
    } catch (error) {
      showMessage(error.response?.data?.message || "Error fetching categories", true);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!currentCategory.name) {
      showMessage("Category name cannot be empty", true);
      return;
    }
    try {
      await CategoryService.createCategory({ name: currentCategory.name });
      showMessage("Category added successfully");
      fetchCategories();
      setIsAddDialogOpen(false);
      setCurrentCategory({ id: null, name: "" });
    } catch (error) {
      showMessage(error.response?.data?.message || "Error adding category", true);
    }
  };

  const handleEditCategory = async () => {
    try {
      await CategoryService.updateCategory(currentCategory.id, { name: currentCategory.name });
      showMessage("Category updated successfully");
      fetchCategories();
      setIsEditDialogOpen(false);
      setCurrentCategory({ id: null, name: "" });
    } catch (error) {
      showMessage(error.response?.data?.message || "Error updating category", true);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
      try {
        await CategoryService.deleteCategory(categoryId);
        showMessage("Category deleted successfully");
        fetchCategories();
      } catch (error) {
        showMessage(error.response?.data?.message || "Error deleting category", true);
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
                        <CardTitle>Categories</CardTitle>
                        <CardDescription>Manage your product categories.</CardDescription>
                    </div>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => setCurrentCategory({ id: null, name: "" })}>Add Category</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Category</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <Label htmlFor="category-name">Category Name</Label>
                                <Input id="category-name" value={currentCategory.name} onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })} />
                            </div>
                            <DialogFooter>
                                <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                                <Button onClick={handleAddCategory}>Add</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                {categories.length > 0 ? (
                    <ul className="space-y-4">
                        {categories.map((category) => (
                            <li key={category.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <span className="font-medium">{category.name}</span>
                                <div className="flex items-center gap-2">
                                  <Dialog open={isEditDialogOpen && currentCategory.id === category.id} onOpenChange={(isOpen) => {
                                    if (!isOpen) setCurrentCategory({ id: null, name: "" });
                                    setIsEditDialogOpen(isOpen);
                                  }}>
                                      <DialogTrigger asChild>
                                          <Button variant="outline" onClick={() => setCurrentCategory(category)}>Edit</Button>
                                      </DialogTrigger>
                                      <DialogContent>
                                          <DialogHeader>
                                              <DialogTitle>Edit Category</DialogTitle>
                                          </DialogHeader>
                                          <div className="grid gap-4 py-4">
                                            <Label htmlFor="category-name-edit">Category Name</Label>
                                            <Input id="category-name-edit" value={currentCategory.name} onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })} />
                                          </div>
                                          <DialogFooter>
                                              <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                                              <Button onClick={handleEditCategory}>Save Changes</Button>
                                          </DialogFooter>
                                      </DialogContent>
                                  </Dialog>
                                  <AlertDialog>
                                      <AlertDialogTrigger asChild><Button variant="destructive">Delete</Button></AlertDialogTrigger>
                                      <AlertDialogContent>
                                          <AlertDialogHeader>
                                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                              <AlertDialogDescription>
                                                  This action cannot be undone. This will permanently delete the category.
                                              </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                                              <AlertDialogAction onClick={() => handleDeleteCategory(category.id)}>Delete</AlertDialogAction>
                                          </AlertDialogFooter>
                                      </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                            </li>
                        ))}
                    </ul>
                     ) : (
                        <div className="flex flex-col items-center justify-center gap-4 p-8 text-center border-2 border-dashed rounded-lg">
                            <div className="text-4xl">🏷️</div>
                            <h3 className="text-xl font-semibold">No Categories Found</h3>
                            <p className="text-muted-foreground">Start by adding your first category.</p>
                            <Button onClick={() => setIsAddDialogOpen(true)}>Add Your First Category</Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </main>
    </Layout>
  );
};

export default CategoryPage;
