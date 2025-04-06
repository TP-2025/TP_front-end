import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/mainSidebar";


export default function Layout() {
    return (
        <SidebarProvider >
            <AppSidebar />
            <main>
                <SidebarTrigger />
            </main>
        </SidebarProvider>
    );
}
