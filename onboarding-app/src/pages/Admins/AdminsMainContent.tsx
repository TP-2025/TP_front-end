"use client"

import { useState, useEffect } from "react"
import { Plus, Search, MoreHorizontal, Trash } from "lucide-react"
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
import { getAdmins, addAdmin as addAdminRequest, deleteAdmin as deleteAdminRequest, type Admin } from "@/api/adminApi"

export default function AdminsMainContent() {
    const [admins, setAdmins] = useState<Admin[]>([])
    const [loading, setLoading] = useState(true)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const { roleId } = useAuth()
    const navigate = useNavigate()
    const [isAddingAdmin, setIsAddingAdmin] = useState(false)
    const [formMessage, setFormMessage] = useState<{ type: "success" | "error" | null; text: string }>({
        type: null,
        text: "",
    })
    const [deletingAdminId, setDeletingAdminId] = useState<number | null>(null)
    const [deleteMessage, setDeleteMessage] = useState<{ type: "success" | "error" | null; text: string }>({
        type: null,
        text: "",
    })

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

    const filteredAdmins = admins.filter(
        (admin) =>
            `${admin.name} ${admin.surname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            admin.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const addAdmin = async (newAdmin: Omit<Admin, "id">) => {
        setIsAddingAdmin(true)
        setFormMessage({ type: null, text: "" })
        try {
            console.log("➕ Adding admin:", newAdmin)
            await addAdminRequest(newAdmin)
            const updatedList = await getAdmins()
            console.log("✅ Admins updated after add:", updatedList)
            setAdmins(updatedList)
            setFormMessage({ type: "success", text: "Admin bol úspešne pridaný!" })
            // Close dialog after 1.5 seconds to show success message
            setTimeout(() => {
                setIsAddOpen(false)
                setFormMessage({ type: null, text: "" })
            }, 1500)
        } catch (error) {
            console.error("❌ Failed to add admin:", error)
            setFormMessage({ type: "error", text: "Nepodarilo sa pridať admina. Skúste to znovu." })
        } finally {
            setIsAddingAdmin(false)
        }
    }

    const handleDelete = async (id: number) => {
        setDeletingAdminId(id)
        setDeleteMessage({ type: null, text: "" })
        try {
            console.log("🗑️ Deleting admin with ID:", id)
            await deleteAdminRequest(id)
            const updatedList = await getAdmins()
            console.log("✅ Admins updated after delete:", updatedList)
            setAdmins(updatedList)
            setDeleteMessage({ type: "success", text: "Admin bol úspešne vymazaný!" })
            // Clear success message after 3 seconds
            setTimeout(() => {
                setDeleteMessage({ type: null, text: "" })
            }, 3000)
        } catch (error) {
            console.error("❌ Failed to delete admin:", error)
            setDeleteMessage({ type: "error", text: "Nepodarilo sa vymazať admina. Skúste to znovu." })
            // Clear error message after 5 seconds
            setTimeout(() => {
                setDeleteMessage({ type: null, text: "" })
            }, 5000)
        } finally {
            setDeletingAdminId(null)
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
                    {deleteMessage.type && (
                        <div
                            className={`p-3 rounded-md text-sm ${
                                deleteMessage.type === "success"
                                    ? "bg-green-50 text-green-800 border border-green-200"
                                    : "bg-red-50 text-red-800 border border-red-200"
                            }`}
                        >
                            {deleteMessage.text}
                        </div>
                    )}
                    <Dialog
                        open={isAddOpen}
                        onOpenChange={(open) => {
                            setIsAddOpen(open)
                            if (open) {
                                setFormMessage({ type: null, text: "" })
                            }
                        }}
                    >
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
                            {formMessage.type && (
                                <div
                                    className={`p-3 rounded-md text-sm ${
                                        formMessage.type === "success"
                                            ? "bg-green-50 text-green-800 border border-green-200"
                                            : "bg-red-50 text-red-800 border border-red-200"
                                    }`}
                                >
                                    {formMessage.text}
                                </div>
                            )}
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
                                        <Label htmlFor="name" className="text-right">
                                            Meno
                                        </Label>
                                        <Input id="name" name="name" className="col-span-3" required disabled={isAddingAdmin} />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="surname" className="text-right">
                                            Priezvisko
                                        </Label>
                                        <Input id="surname" name="surname" className="col-span-3" required disabled={isAddingAdmin} />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="email" className="text-right">
                                            Email
                                        </Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            className="col-span-3"
                                            required
                                            disabled={isAddingAdmin}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} disabled={isAddingAdmin}>
                                        Zruš
                                    </Button>
                                    <Button type="submit" disabled={isAddingAdmin}>
                                        {isAddingAdmin ? "Pridávam..." : "Ulož Admina"}
                                    </Button>
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
                                        <TableRow key={admin.id || index}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={`/placeholder.svg`} alt={`${admin.name} ${admin.surname}`} />
                                                        <AvatarFallback>{(admin.name[0] + admin.surname[0]).toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        {admin.name} {admin.surname}
                                                    </div>
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
                                                        <DropdownMenuItem
                                                            className="text-red-600"
                                                            onClick={() => handleDelete(admin.id)}
                                                            disabled={deletingAdminId === admin.id}
                                                        >
                                                            <Trash className="mr-2 h-4 w-4" />
                                                            <span>{deletingAdminId === admin.id ? "Mažem..." : "Vymaž"}</span>
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
