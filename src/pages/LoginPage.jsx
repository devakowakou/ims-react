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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950">
        <form onSubmit={handleLogin}>
            <Card className="w-full max-w-sm">
                <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                    Enter your email below to login to your account.
                </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                {message && <p className="text-sm text-red-500">{message}</p>}
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button type="submit" className="w-full">
                        Login
                    </Button>
                    <div className="text-sm text-center">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-blue-500 hover:underline">
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
