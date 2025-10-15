import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuhtService from "../service/AuthService";
import ThemeToggle from "../component/ThemeToggle";
import Logo from "../component/Logo";
import {
  Home,
  ArrowRightLeft,
  LayoutGrid,
  Package,
  Users,
  ShoppingCart,
  HandCoins,
  CircleUser,
  LogOut,
  Menu
} from 'lucide-react';
import { Button } from "@/component/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
  } from "@/component/ui/sheet";

const Sidebar = () => {
  const isAuth = AuhtService.isAuthenticated();
  const navigate = useNavigate();

  const logout = () => {
    AuhtService.logout();
    navigate('/login');
  };

  return (
    <>
        <div className="hidden border-r bg-card/80 backdrop-blur-md md:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-14 items-center justify-between border-b px-4 lg:h-[60px] lg:px-6">
                    <Link to="/" className="flex items-center">
                        <Logo className="h-8 w-8" showText={false} />
                    </Link>
                    <ThemeToggle />
                </div>
                <div className="flex-1">
                    <NavLinks />
                </div>
                {isAuth && (
                    <div className="mt-auto p-4">
                        <button
                            onClick={logout}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent"
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </div>
    </>
  );
};

export const MobileSidebar = () => {
    const isAuth = AuhtService.isAuthenticated();
    const navigate = useNavigate();

    const logout = () => {
        AuhtService.logout();
        navigate('/login');
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 border-gray-300 text-gray-900 hover:bg-gray-100 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col bg-card border-r-0">
                <NavLinks />
                {isAuth && (
                    <div className="mt-auto p-4">
                        <button
                            onClick={logout}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent"
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    )
}

export const NavLinks = () => {
    const isAuth = AuhtService.isAuthenticated();
    const isAdmin = AuhtService.isAdmin();
    const location = useLocation();

    const isActiveLink = (path) => {
        return location.pathname === path || (path !== '/dashboard' && location.pathname.startsWith(path));
    };

    const menuItems = [
        { path: "/dashboard", label: "Dashboard", icon: <Home className="h-4 w-4" />, show: isAuth },
        { path: "/transaction", label: "Transactions", icon: <ArrowRightLeft className="h-4 w-4" />, show: isAuth },
        { path: "/category", label: "Category", icon: <LayoutGrid className="h-4 w-4" />, show: isAdmin },
        { path: "/product", label: "Product", icon: <Package className="h-4 w-4" />, show: isAdmin },
        { path: "/supplier", label: "Supplier", icon: <Users className="h-4 w-4" />, show: isAuth },
        { path: "/purchase", label: "Purchase", icon: <ShoppingCart className="h-4 w-4" />, show: isAuth },
        { path: "/sell", label: "Sell", icon: <HandCoins className="h-4 w-4" />, show: isAuth },
        { path: "/profile", label: "Profile", icon: <CircleUser className="h-4 w-4" />, show: isAuth },
    ];

    return (
        <nav className="grid gap-2 text-lg font-medium p-4">
            {menuItems.map((item) =>
                item.show && (
                    <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent ${
                        isActiveLink(item.path) ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                    }`}
                    >
                    {item.icon}
                    {item.label}
                    </Link>
                )
            )}
        </nav>
    )
}

export default Sidebar;
