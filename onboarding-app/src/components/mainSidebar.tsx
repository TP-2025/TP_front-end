import {
    Home,
    Users,
    Shield,
    UserCircle,
    Info,
    Settings,
    LogOut,
    Image,
} from "lucide-react"
import { Link } from "react-router-dom"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from "@/Security/authContext"


const bottomItem = {
    title: "Logout",
    url: "#",
    icon: LogOut,
}

export function AppSidebar() {
    const LogoutIcon = bottomItem.icon
    const { role } = useAuth()
    return (
        <Sidebar>
            <SidebarContent className="flex flex-col justify-between h-full">
                <div>
                    <SidebarGroup>
                        <SidebarGroupLabel className="text-sm text-gray-600">Dashboard</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link to="/home" className="flex items-center gap-3 p-5 hover:bg-gray-100 rounded transition-colors">
                                            <Home />
                                            <span className="text-lg font-medium text-gray-700">Home</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link to="/info" className="flex items-center gap-3 p-5 hover:bg-gray-100 rounded transition-colors">
                                            <Info />
                                            <span className="text-lg font-medium text-gray-700">Info</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    <SidebarGroup>
                        <SidebarGroupLabel className="text-sm text-gray-600">Apps</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link to="/photos" className="flex items-center gap-3 p-5 hover:bg-gray-100 rounded transition-colors">
                                            <Image />
                                            <span className="text-lg font-medium text-gray-700">Photos</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    <SidebarGroup>
                        <SidebarGroupLabel className="text-sm text-gray-600">Users</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {role === "admin" && (
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <Link to="/doctors" className="flex items-center gap-3 p-5 hover:bg-gray-100 rounded transition-colors">
                                                <UserCircle />
                                                <span className="text-lg font-medium text-gray-700">Doctors</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )}
                                {(role === "admin" || role === "doktor") &&(
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <Link to="/moderators" className="flex items-center gap-3 p-5 hover:bg-gray-100 rounded transition-colors">
                                                <Shield />
                                                <span className="text-lg font-medium text-gray-700">Moderators</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )}
                                {(role === "admin" || role === "doktor" || role === "moderator") && (
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <Link to="/patients" className="flex items-center gap-3 p-5 hover:bg-gray-100 rounded transition-colors">
                                                <Users />
                                                <span className="text-lg font-medium text-gray-700">Patients</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    <SidebarGroup>
                        <SidebarGroupLabel className="text-sm text-gray-600">System</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link to="/settings" className="flex items-center gap-3 p-5 hover:bg-gray-100 rounded transition-colors">
                                            <Settings />
                                            <span className="text-lg font-medium text-gray-700">Settings</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </div>

                <div className="pb-4">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link
                                    to={bottomItem.url}
                                    className="group flex items-center gap-3 p-3 rounded-md hover:bg-green-100 transition-colors"
                                >
                                    <LogoutIcon className="w-6 h-6 " />
                                    <span className="text-lg font-medium ">
                                        {bottomItem.title}
                                    </span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </div>
            </SidebarContent>
        </Sidebar>
    )
}
