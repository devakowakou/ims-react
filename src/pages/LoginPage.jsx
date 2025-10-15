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

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const loginData = { email, password };
      const res = await AuthService.loginUser(loginData);

      if (res?.token) {
        AuthService.saveToken(res.token);
        AuthService.saveRole(res.role);
        showMessage(res.message || "Login Successful! Redirecting...");

        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        showMessage(res?.message || "Login failed");
      }
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error logging in user: " + error
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <form onSubmit={handleLogin}>
            <Card className="w-full max-w-sm bg-gray-800 border-gray-700 shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
                    <CardDescription className="text-gray-400 pt-2">
                        Sign in to continue to your dashboard.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    {message && <p className="text-sm text-red-500 text-center">{message}</p>}
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-gray-300">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md">
                        Login
                    </Button>
                    <div className="mt-2 text-center text-sm text-gray-400">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-purple-400 hover:underline">
                            Register
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </form>
    </div>
  );
};

export default LoginPage;
