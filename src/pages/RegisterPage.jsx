import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthService from "../service/AuthService";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const registerData = { name, email, password, phoneNumber };
      const res = await AuthService.registerUser(registerData);

      if (res) {
        showMessage("Registration Successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error registering user: " + error
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <form onSubmit={handleRegister}>
            <Card className="w-full max-w-sm bg-gray-800 border-gray-700 shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold">Create an Account</CardTitle>
                    <CardDescription className="text-gray-400 pt-2">
                        Join us and start your journey.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    {message && <p className="text-sm text-red-500 text-center">{message}</p>}
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="text-gray-300">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="John Doe"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 rounded-md"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-gray-300">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.targe.value)}
                            className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 rounded-md"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password" className="text-gray-300">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-gray-700 border-gray-600 text-white rounded-md"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="phone-number" className="text-gray-300">Phone Number</Label>
                        <Input
                            id="phone-number"
                            type="text"
                            placeholder="+1 234 567 890"
                            required
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 rounded-md"
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md">
                        Register
                    </Button>
                    <div className="mt-2 text-center text-sm text-gray-400">
                        Already have an account?{" "}
                        <Link to="/login" className="text-purple-400 hover:underline">
                            Login
                        </Link>
                    </div>
                </CardFooter>
            </Card>
      </form>
    </div>
  );
};

export default RegisterPage;
