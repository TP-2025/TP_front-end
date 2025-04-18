// src/pages/Pacients/PacientsMainContent.tsx
"use client"

import { useState, useEffect } from "react"
import { Plus, Search, MoreHorizontal, Edit, Trash } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle}

from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow}

from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage}

from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter,
         DialogHeader, DialogTitle, DialogTrigger}

from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger}

from "@/components/ui/dropdown-menu"
import { useAuth } from "@/Security/authContext"
import { useNavigate } from "react-router-dom"

type Patient = {
    id: number
    name: string
    email: string
    phone: string
    joinDate: string
}

const mockPatients: Patient[] = [
    {
        id: 1,
        name: "Alice Novak",
        email: "alice.novak@example.com",
        phone: "+421 987 654 321",
        joinDate: "Apr 5, 2024",
    },
    {
        id: 2,
        name: "Peter Kováč",
        email: "peter.kovac@example.com",
        phone: "+421 912 345 678",
        joinDate: "Mar 12, 2023",
    },
]

export default function PacientsMainContent() {
    const [patients, setPatients] = useState<Patient[]>(mockPatients)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const { role } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (!["admin", "doktor", "moderator"].includes(role || "")) {
            navigate("/")
        }
    }, [role, navigate])

    if (!["admin", "doktor", "moderator"].includes(role || "")) return null

    const filteredPatients = patients.filter(
        (p) =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.phone.includes(searchTerm)
    )

    const addPatient = (newP: Omit<Patient, "id" | "joinDate">) => {
        setPatients([
            ...patients,
            {
                id: patients.length + 1,
                ...newP,
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
                    <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
                    <p className="text-muted-foreground">Manage registered patients.</p>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search patients..."
                            className="w-full pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button className="shrink-0">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Patient
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[525px]">
                            <DialogHeader>
                                <DialogTitle>Add New Patient</DialogTitle>
                                <DialogDescription>Enter the patient's contact info.</DialogDescription>
                            </DialogHeader>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault()
                                    const form = e.currentTarget as HTMLFormElement
                                    const formData = new FormData(form)
                                    const newPatient = {
                                        name: formData.get("name") as string,
                                        email: formData.get("email") as string,
                                        phone: formData.get("phone") as string,
                                    }
                                    addPatient(newPatient)
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
                                    <Button type="submit">Save Patient</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Patient List</CardTitle>
                        <CardDescription>Overview of registered patients.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Join Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredPatients.length > 0 ? (
                                    filteredPatients.map((p) => (
                                        <TableRow key={p.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src="/placeholder.svg" alt={p.name} />
                                                        <AvatarFallback>{p.name[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <div>{p.name}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{p.email}</TableCell>
                                            <TableCell>{p.phone}</TableCell>
                                            <TableCell>{p.joinDate}</TableCell>
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
                                        <TableCell colSpan={5} className="text-center h-24">
                                            No patients found.
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
