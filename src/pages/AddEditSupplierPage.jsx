
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
import { Textarea } from "../component/ui/textarea"; // Using Textarea for longer address fields
import SupplierService from "../service/SupplierService";

const AddEditSupplierPage = () => {
  const { supplierId } = useParams();
  const [name, setName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState({ text: "", isError: false });
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (supplierId) {
      setIsEditing(true);
      const fetchSupplier = async () => {
        try {
          const supplierData = await SupplierService.getSupplierById(supplierId);
          if (supplierData.status === 200) {
            const { supplier } = supplierData;
            setName(supplier.name);
            setContactInfo(supplier.contactInfo);
            setAddress(supplier.address);
          }
        } catch (error) {
          showMessage(error.response?.data?.message || "Error fetching supplier details", true);
        }
      };
      fetchSupplier();
    }
  }, [supplierId]);

  const showMessage = (msg, isError = false) => {
    setMessage({ text: msg, isError });
    setTimeout(() => setMessage({ text: "", isError: false }), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const supplierData = { name, contactInfo, address };

    try {
      if (isEditing) {
        await SupplierService.updateSupplier(supplierId, supplierData);
        showMessage("Supplier updated successfully");
      } else {
        await SupplierService.addSupplier(supplierData);
        showMessage("Supplier added successfully");
      }
      setTimeout(() => navigate("/supplier"), 1500);
    } catch (error) {
      showMessage(error.response?.data?.message || "Error saving supplier", true);
    }
  };

  return (
    <Layout>
      <main className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>{isEditing ? "Edit Supplier" : "Add New Supplier"}</CardTitle>
            <CardDescription>{isEditing ? "Update your supplier details." : "Fill in the details to add a new supplier."}</CardDescription>
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
                      <Label htmlFor="name">Supplier Name</Label>
                      <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Global Supplies Inc."/>
                  </div>
                  <div className="grid gap-2">
                      <Label htmlFor="contactInfo">Contact Info</Label>
                      <Input id="contactInfo" value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} required placeholder="e.g. contact@globalsupplies.com"/>
                  </div>
              </div>
              <div className="grid gap-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} required placeholder="e.g. 123 Supply Street, City, Country"/>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit">{isEditing ? "Update Supplier" : "Save Supplier"}</Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </Layout>
  );
};
export default AddEditSupplierPage;
