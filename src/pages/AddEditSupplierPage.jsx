import React, { useState, useEffect } from "react";
import Layout from "../components/component/Layout";
import ApiService from "../service/ApiService";
import { useNavigate, useParams } from "react-router-dom";
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

const AddEditSupplierPage = () => {
  const { supplierId } = useParams();
  const [name, setName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (supplierId) {
      setIsEditing(true);

      const fetchSupplier = async () => {
        try {
          const supplierData = await ApiService.getSupplierById(supplierId);
          if (supplierData.status === 200) {
            setName(supplierData.supplier.name);
            setContactInfo(supplierData.supplier.contactInfo);
            setAddress(supplierData.supplier.address);
          }
        } catch (error) {
          showMessage(
            error.response?.data?.message ||
              "Error Getting a Supplier by Id: " + error
          );
        }
      };
      fetchSupplier();
    }
  }, [supplierId]);

  // handle form submission for both add and edit supplier
  const handleSubmit = async (e) => {
    e.preventDefault();
    const supplierData = { name, contactInfo, address };

    try {
      if (isEditing) {
        await ApiService.updateSupplier(supplierId, supplierData);
        showMessage("Supplier Edited successfully");
        navigate("/supplier");
      } else {
        await ApiService.addSupplier(supplierData);
        showMessage("Supplier Added successfully");
        navigate("/supplier");
      }
    } catch (error) {
      showMessage(
        error.response?.data?.message ||
          "Error Saving a Supplier: " + error
      );
    }
  };

  // method to show message or errors
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
          <CardHeader>
            <CardTitle>{isEditing ? "Edit Supplier" : "Add New Supplier"}</CardTitle>
            <CardDescription>{isEditing ? "Update your supplier details" : "Fill in the details to add a new supplier"}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="name">Supplier Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  type="text"
                  placeholder="Enter supplier name"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="contactInfo">Contact Info</Label>
                <Input
                  id="contactInfo"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  required
                  type="text"
                  placeholder="Enter contact information"
                />
              </div>

              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  type="text"
                  placeholder="Enter full address"
                />
              </div>
              <CardFooter className="md:col-span-2">
                <Button type="submit" className="ml-auto">
                  {isEditing ? "Update Supplier" : "Add Supplier"}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </main>
    </Layout>
  );
};
export default AddEditSupplierPage;
