import React from "react";
import Sidebar, { MobileSidebar } from "./Sidebar";
import ThemeToggle from "../component/ThemeToggle";
import UserMenu from "../component/UserMenu";
import Logo from "../component/Logo";

const Layout = ({children}) =>{
    return(
        <div className="flex h-screen bg-mesh-gradient-light dark:bg-mesh-gradient-dark">
            <Sidebar/>
            <div className="flex flex-col flex-1">
                {/* Mobile Header */}
                <header className="flex h-14 items-center justify-between gap-4 border-b bg-card/80 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6 md:hidden">
                    <div className="flex items-center gap-3">
                        <MobileSidebar />
                        <Logo className="h-7 w-7" showText={false} />
                    </div>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <UserMenu />
                    </div>
                </header>
                {/* Desktop Header */}
                <header className="hidden md:flex h-14 items-center justify-between gap-4 border-b bg-card/80 backdrop-blur-sm px-6 lg:h-[60px]">
                    <div className="flex items-center gap-3">
                        <Logo className="h-8 w-8" showText={true} />
                        <span className="text-sm text-muted-foreground">Inventory Management System</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <UserMenu />
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default Layout;
