
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../component/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../component/ui/card";
import { Input } from "../component/ui/input";
import { Label } from "../component/ui/label";
import AuthService from "../service/AuthService";

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
        
        // Redirect to dashboard after a short delay
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        showMessage(res?.message || "Login failed");
      }
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error logging in: " + error.message
      );
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account.
          </CardDescription>
          {message && <p className="text-sm text-red-500 mt-2">{message}</p>} 
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password"
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button type="submit" className="w-full">Sign in</Button>
            <div className="mt-4 text-center text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
