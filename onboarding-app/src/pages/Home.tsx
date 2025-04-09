import { Outlet } from "react-router-dom"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/mainSidebar"

export default function Layout() {
    return (
        <SidebarProvider>
            <div className="flex w-full min-h-screen">
                <AppSidebar />
                <main className="flex-1 flex flex-col">
                    <div className="flex items-center h-16 px-4 border-b">
                        <SidebarTrigger />
                        <h1 className="ml-4 text-lg font-semibold">Dashboard</h1>
                    </div>
                    <div className="flex-1 p-4">
                        <Outlet />
                    </div>
                </main>
            </div>
        </SidebarProvider>
    )
}
