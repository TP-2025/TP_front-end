"use client"

import { useState, useEffect } from "react"
import { Plus, Search, MoreHorizontal, Edit, Trash } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
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

type Moderator = {
    id: number
    name: string
    email: string
    phone: string
    status: string
    joinDate: string
}

const mockModerators: Moderator[] = [
    {
        id: 1,
        name: "Jane dawd",
        email: "jane.adwd@example.com",
        phone: "+421 4697685132",
        status: "Active",
        joinDate: "Feb 5, 2023",
    },
    {
        id: 2,
        name: "Tom rer",
        email: "tom.wefev@example.com",
        phone: "+421 9164732684",
        status: "On Leave",
        joinDate: "Jul 10, 2022",
    },
]

export default function ModeratorsMainContent() {
    const [moderators, setModerators] = useState<Moderator[]>(mockModerators)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const { role } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (!["admin", "doktor"].includes(role || "")) {
            navigate("/")
        }
    }, [role, navigate])

    if (!["admin", "doktor"].includes(role || "")) return null


    const filteredModerators = moderators.filter(
        (mod) =>
            mod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            mod.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            mod.phone.includes(searchTerm)
    )

    const addModerator = (newMod: Omit<Moderator, "id" | "status" | "joinDate">) => {
        setModerators([
            ...moderators,
            {
                id: moderators.length + 1,
                ...newMod,
                status: "Active",
                joinDate: new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                }),
            },
        ])
        setIsAddOpen(false)
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Active":
                return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
            case "On Leave":
                return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">On Leave</Badge>
            case "Inactive":
                return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Inactive</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    return (
        <div className="flex-1 p-6 lg:p-8">
            <div className="space-y-6">
                <div className="flex flex-col space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Moderators</h1>
                    <p className="text-muted-foreground">Manage moderator accounts and access.</p>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search moderators..."
                            className="w-full pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button className="shrink-0">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Moderator
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[525px]">
                            <DialogHeader>
                                <DialogTitle>Add New Moderator</DialogTitle>
                                <DialogDescription>Fill in the moderator's contact info.</DialogDescription>
                            </DialogHeader>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault()
                                    const form = e.currentTarget as HTMLFormElement
                                    const formData = new FormData(form)
                                    const newMod = {
                                        name: formData.get("name") as string,
                                        email: formData.get("email") as string,
                                        phone: formData.get("phone") as string,
                                    }
                                    addModerator(newMod)
                                }}
                            >
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">Name</Label>
                                        <Input id="name" name="name" className="col-span-3" required />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="email" className="text-right">Email</Label>
                                        <Input id="email" name="email" type="email" className="col-span-3" required />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="phone" className="text-right">Phone</Label>
                                        <Input id="phone" name="phone" className="col-span-3" required />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                                    <Button type="submit">Save Moderator</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Moderator List</CardTitle>
                        <CardDescription>Overview of all system moderators.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-1/5">Name</TableHead>
                                    <TableHead className="w-1/5">Email</TableHead>
                                    <TableHead className="w-1/5">Phone</TableHead>
                                    <TableHead className="w-1/5">Status</TableHead>
                                    <TableHead className="w-1/5">Join Date</TableHead>
                                    <TableHead className="w-1/5 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredModerators.length > 0 ? (
                                    filteredModerators.map((mod) => (
                                        <TableRow key={mod.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={`/placeholder.svg`} alt={mod.name} />
                                                        <AvatarFallback>{mod.name[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <div>{mod.name}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{mod.email}</TableCell>
                                            <TableCell>{mod.phone}</TableCell>
                                            <TableCell>{getStatusBadge(mod.status)}</TableCell>
                                            <TableCell>{mod.joinDate}</TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            <span>Edit</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-600">
                                                            <Trash className="mr-2 h-4 w-4" />
                                                            <span>Delete</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-24">
                                            No moderators found.
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
