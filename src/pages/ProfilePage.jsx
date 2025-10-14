import React, { useState, useEffect } from "react";
import Layout from "../components/component/Layout";
import UserService from "../service/UserService";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await UserService.getLoggedInUsesInfo();
        setUser(userInfo);
      } catch (error) {
        showMessage(
          error.response?.data?.message || "Error fetching user info: " + error
        );
      }
    };
    fetchUserInfo();
  }, []);

  // Method to show message or errors
  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  // Get role-specific emoji
  const getRoleEmoji = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin': return '👑';
      case 'manager': return '💼';
      case 'user': return '👤';
      default: return '😊';
    }
  };

  return (
    <Layout>
      <main className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
        {message && <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{message}</div>}
        {user && (
          <Card>
            <CardHeader className="flex flex-col items-center text-center">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src={`https://i.pravatar.cc/150?u=${user.email}`} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">{user.name} {getRoleEmoji(user.role)}</CardTitle>
              <CardDescription>Welcome to your personal dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="text-lg font-semibold">{user.name}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-lg font-semibold">{user.email}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Phone Number</p>
                  <p className="text-lg font-semibold">{user.phoneNumber}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Role</p>
                  <p className="text-lg font-semibold">{user.role} {getRoleEmoji(user.role)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </Layout>
  );
};
export default ProfilePage;
