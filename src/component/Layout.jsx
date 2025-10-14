import React from "react";
import Sidebar, { MobileSidebar } from "./Sidebar";

const Layout = ({children}) =>{
    return(
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            <Sidebar/>
            <div className="flex flex-col flex-1">
                <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 md:hidden">
                    <MobileSidebar />
                    <div className="w-full flex-1">
                        <h1 className="text-lg font-semibold">IMS</h1>
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
