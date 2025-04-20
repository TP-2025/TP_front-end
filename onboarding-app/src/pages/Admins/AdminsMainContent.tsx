"use client"

import { useState, useEffect } from "react"
import { Plus, Search, MoreHorizontal, Edit, Trash } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/Security/authContext"
import { useNavigate } from "react-router-dom"

type Admin = {
    id: number
    name: string
    email: string
    phone: string
    joinDate: string
}

const mockAdmins: Admin[] = [
    {
        id: 1,
        name: "Alice Smith",
        email: "alice.smith@example.com",
        phone: "+421 912345678",
        joinDate: "Jan 1, 2024",
    },
    {
        id: 2,
        name: "Bob Johnson",
        email: "bob.johnson@example.com",
        phone: "+421 987654321",
        joinDate: "Feb 12, 2024",
    },
]

export default function AdminsMainContent() {
    const [admins, setAdmins] = useState<Admin[]>(mockAdmins)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const { role } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (role !== "admin") {
            navigate("/")
        }
    }, [role, navigate])

    if (role !== "admin") return null

    const filteredAdmins = admins.filter(
        (admin) =>
            admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            admin.phone.includes(searchTerm)
    )

    const addAdmin = (newAdmin: Omit<Admin, "id" | "joinDate">) => {
        setAdmins([
            ...admins,
            {
                id: admins.length + 1,
                ...newAdmin,
                joinDate: new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                }),
            },
        ])
        setIsAddOpen(false)
    }

    return (
        <div className="flex-1 p-6 lg:p-8">
            <div className="space-y-6">
                <div className="flex flex-col space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Admini</h1>
                    <p className="text-muted-foreground">Spravuj zoznam adminov.</p>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Hľadaj adminov..."
                            className="w-full pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button className="shrink-0">
                                <Plus className="mr-2 h-4 w-4" />
                                Pridaj Admina
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[525px]">
                            <DialogHeader>
                                <DialogTitle>Pridaj nového admina</DialogTitle>
                                <DialogDescription>Vyplň údaje</DialogDescription>
                            </DialogHeader>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault()
                                    const form = e.currentTarget as HTMLFormElement
                                    const formData = new FormData(form)
                                    const newAdmin = {
                                        name: formData.get("name") as string,
                                        email: formData.get("email") as string,
                                        phone: formData.get("phone") as string,
                                    }
                                    addAdmin(newAdmin)
                                }}
                            >
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">Meno</Label>
                                        <Input id="name" name="name" className="col-span-3" required />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="email" className="text-right">Email</Label>
                                        <Input id="email" name="email" type="email" className="col-span-3" required />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="phone" className="text-right">Tel. číslo</Label>
                                        <Input id="phone" name="phone" className="col-span-3" required />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Zruš</Button>
                                    <Button type="submit">Ulož Admina</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Zoznam adminov</CardTitle>
                        <CardDescription>Prehľad všetkých registovaných adminov</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-1/4">Meno</TableHead>
                                    <TableHead className="w-1/4">Email</TableHead>
                                    <TableHead className="w-1/4">Tel. číslo</TableHead>
                                    <TableHead className="w-1/4">Dátum pridania</TableHead>
                                    <TableHead className="w-1/4 text-right">Akcie</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredAdmins.length > 0 ? (
                                    filteredAdmins.map((admin) => (
                                        <TableRow key={admin.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={`/placeholder.svg`} alt={admin.name} />
                                                        <AvatarFallback>{admin.name[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <div>{admin.name}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{admin.email}</TableCell>
                                            <TableCell>{admin.phone}</TableCell>
                                            <TableCell>{admin.joinDate}</TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            <span>Uprav</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-600">
                                                            <Trash className="mr-2 h-4 w-4" />
                                                            <span>Vymaž</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center h-24">
                                            Nenašiel sa admin
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
