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
import { getAdmins, addAdmin as addAdminRequest, deleteAdmin as deleteAdminRequest } from "@/api/adminApi"

import { Admin } from "@/api/adminApi"


export default function AdminsMainContent() {
    const [admins, setAdmins] = useState<Admin[]>([])
    const [loading, setLoading] = useState(true)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const { roleId } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (roleId !== 4) {
            navigate("/")
            return
        }

        getAdmins()
            .then((data) => {
                console.log("getAdmins response:", data)
                if (Array.isArray(data)) {
                    setAdmins(data)
                } else {
                    console.error("❌ getAdmins() did not return an array:", data)
                    setAdmins([])
                }
            })
            .catch((err) => {
                console.error("❌ Failed to load admins:", err)
                setAdmins([])
            })
            .finally(() => setLoading(false))
    }, [roleId, navigate])



    if (roleId !== 4) return null

    const filteredAdmins = admins.filter((admin) =>
        `${admin.name} ${admin.surname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const addAdmin = async (newAdmin: Omit<Admin, "id">) => {

        try {
            await addAdminRequest(newAdmin)
            const updatedList = await getAdmins()
            setAdmins(updatedList)
            setIsAddOpen(false)
        } catch (error) {
            console.error("❌ Failed to add admin:", error)
        }
    }

    const handleDelete = async (id: number) => {
        try {
            await deleteAdminRequest(id)
            const updatedList = await getAdmins()
            setAdmins(updatedList)
        } catch (error) {
            console.error("❌ Failed to delete admin:", error)
        }
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
                                        surname: formData.get("surname") as string,
                                        email: formData.get("email") as string,
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
                                        <Label htmlFor="surname" className="text-right">Priezvisko</Label>
                                        <Input id="surname" name="surname" className="col-span-3" required />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="email" className="text-right">Email</Label>
                                        <Input id="email" name="email" type="email" className="col-span-3" required />
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
                                    <TableHead className="w-1/2">Meno</TableHead>
                                    <TableHead className="w-1/2">Email</TableHead>
                                    <TableHead className="text-right">Akcie</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center h-24">
                                            Načítavam adminov...
                                        </TableCell>
                                    </TableRow>
                                ) : filteredAdmins.length > 0 ? (
                                    filteredAdmins.map((admin, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={`/placeholder.svg`} alt={`${admin.name} ${admin.surname}`} />
                                                        <AvatarFallback>
                                                            {(admin.name[0] + admin.surname[0]).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>{admin.name} {admin.surname}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{admin.email}</TableCell>
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
                                                        <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(admin.id)}>
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
                                        <TableCell colSpan={3} className="text-center h-24">
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
