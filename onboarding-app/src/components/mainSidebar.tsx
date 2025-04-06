import {
    Home,
    Users,
    Shield,
    UserCircle,
    Image,
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

const items = [
    { title: "Home", url: "#", icon: Home },
    { title: "Doctors", url: "#", icon: UserCircle },
    { title: "Moderators", url: "#", icon: Shield },
    { title: "Patients", url: "#", icon: Users },
    { title: "Photos", url: "#", icon: Image },
    { title: "Info", url: "#", icon: Info },
    { title: "Settings", url: "#", icon: Settings },
]


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
                        <SidebarGroupLabel className="text-lg font-semibold">Menu</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <a
                                                href={item.url}
                                                className="flex items-center gap-3 p-5 hover:bg-gray-700 rounded transition-colors"
                                            >
                                                <item.icon className="w-6 h-6 " />
                                                <span className="text-xl">{item.title}</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
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
