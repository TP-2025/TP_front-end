import {
    Home,
    Users,
    Shield,
    UserCircle,
    Info,
    Settings,
    LogOut,
} from "lucide-react"

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


const bottomItem = {
    title: "Logout",
    url: "#",
    icon: LogOut,
}

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarContent  className="flex flex-col justify-between h-full">
                <div>
                    <SidebarGroup>
                        <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild isActive={true}>
                                        <a href="/">
                                            <Home />
                                            <span>Home</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <a href="/Info">
                                            <Info />
                                            <span>Info</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    <SidebarGroup>
                        <SidebarGroupLabel>Users</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <a href="/dostors">
                                            <UserCircle />
                                            <span>Doctors</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <a href="/moderators">
                                            <Shield />
                                            <span>Moderators</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <a href="/patients">
                                            <Users />
                                            <span>Patients</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    <SidebarGroup>
                        <SidebarGroupLabel>System</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <a href="/settings">
                                            <Settings />
                                            <span>Settings</span>
                                        </a>
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
                                <a
                                    href={bottomItem.url}
                                    className="group flex items-center gap-3 p-3 rounded-md hover:bg-green-100 transition-colors"
                                >
                                    <bottomItem.icon className="w-6 h-6 text-gray-600 group-hover:text-green-600" />
                                    <span className="text-lg font-medium group-hover:text-green-600">
                                        {bottomItem.title}
                                    </span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </div>
            </SidebarContent>
        </Sidebar>
    )
}
