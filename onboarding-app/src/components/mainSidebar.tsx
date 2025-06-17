import {
    Home,
    Users,
    Shield,
    UserCircle,
    Settings,
    LogOut,
    Image,
    Crown,
    ScanEye,
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
import { useLogout } from "@/pages/otherSidebarStuff/Logout"

const bottomItem = {
    title: "Logout",
    url: "#",
    icon: LogOut,
}

export function AppSidebar() {
    const LogoutIcon = bottomItem.icon
    const { roleId } = useAuth() // ⬅️ use roleId instead of role
    const logout = useLogout()

    return (
        <Sidebar>
            <SidebarContent className="flex flex-col justify-between h-full">
                <div>
                    <SidebarGroup>
                        <SidebarGroupLabel className="text-sm text-gray-600">Menu</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link to="/domov" className="flex items-center gap-3 p-5 hover:bg-gray-100 rounded transition-colors">
                                            <Home />
                                            <span className="text-lg font-medium text-gray-700">Domov</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    <SidebarGroup>
                        <SidebarGroupLabel className="text-sm text-gray-600">Aplikácie</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link to="/AddPhoto" className="flex items-center gap-3 p-5 hover:bg-gray-100 rounded transition-colors">
                                            <Image />
                                            <span className="text-lg font-medium text-gray-700">Pridávanie fotiek</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                {(roleId === 4 || roleId === 3 ) &&(
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link to="/Analyze" className="flex items-center gap-3 p-5 hover:bg-gray-100 rounded transition-colors">
                                            <ScanEye />
                                            <span className="text-lg font-medium text-gray-700">Analýza fotiek</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                )}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    <SidebarGroup>
                        <SidebarGroupLabel className="text-sm text-gray-600">Používatelia</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {roleId === 4 && (
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <Link to="/admins" className="flex items-center gap-3 p-5 hover:bg-gray-100 rounded transition-colors">
                                                <Crown />
                                                <span className="text-lg font-medium text-gray-700">Admini</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )}
                                {roleId === 4 && (
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <Link to="/doctors" className="flex items-center gap-3 p-5 hover:bg-gray-100 rounded transition-colors">
                                                <UserCircle />
                                                <span className="text-lg font-medium text-gray-700">Doktori</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )}
                                {(roleId === 4 || roleId === 3) && (
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <Link to="/moderators" className="flex items-center gap-3 p-5 hover:bg-gray-100 rounded transition-colors">
                                                <Shield />
                                                <span className="text-lg font-medium text-gray-700">Technici</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )}
                                {(roleId === 4 || roleId === 3 || roleId === 2) && (
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <Link to="/patients" className="flex items-center gap-3 p-5 hover:bg-gray-100 rounded transition-colors">
                                                <Users />
                                                <span className="text-lg font-medium text-gray-700">Pacienti</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    <SidebarGroup>
                        <SidebarGroupLabel className="text-sm text-gray-600">Systém</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {(roleId === 4 || roleId === 3 || roleId === 2) && (
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link to="/settings" className="flex items-center gap-3 p-5 hover:bg-gray-100 rounded transition-colors">
                                            <Settings />
                                            <span className="text-lg font-medium text-gray-700">Nastavenia</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                )}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </div>

                <div className="pb-4">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                onClick={logout}
                                className="group flex items-center gap-3 p-3 rounded-md hover:bg-green-100 transition-colors"
                            >
                                <LogoutIcon className="w-6 h-6" />
                                <span className="text-lg font-medium">Odhlásiť sa</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </div>
            </SidebarContent>
        </Sidebar>
    )
}
