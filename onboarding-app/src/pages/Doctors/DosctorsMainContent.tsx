"use client"

import { DialogTrigger } from "@/components/ui/dialog"

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
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/Security/authContext"
import { useNavigate } from "react-router-dom"
import {
    getDoctors,
    addDoctor as addDoctorRequest,
    deleteDoctor as deleteDoctorRequest,
    type Doctor,
} from "@/api/doctorApi"

export default function DoctorsMainContent() {
    const [doctors, setDoctors] = useState<Doctor[]>([])
    const [loading, setLoading] = useState(true)
    const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const { roleId } = useAuth()
    const navigate = useNavigate()
    const [isAddingDoctor, setIsAddingDoctor] = useState(false)
    const [formMessage, setFormMessage] = useState<{ type: "success" | "error" | null; text: string }>({
        type: null,
        text: "",
    })
    const [deletingDoctorId, setDeletingDoctorId] = useState<number | null>(null)
    const [deleteMessage, setDeleteMessage] = useState<{ type: "success" | "error" | null; text: string }>({
        type: null,
        text: "",
    })

    useEffect(() => {
        if (roleId !== 4) {
            navigate("/")
            return
        }

        console.log("🔄 Fetching doctors...")
        setLoading(true)
        getDoctors()
            .then((data) => {
                console.log("✅ Doctors loaded:", data)
                setDoctors(data)
            })
            .catch((err) => {
                console.error("❌ Failed to load doctors:", err)
                setDoctors([])
            })
            .finally(() => setLoading(false))
    }, [roleId, navigate])

    if (roleId !== 4) return null

    const filteredDoctors = (doctors || []).filter(
        (doctor) =>
            `${doctor.name} ${doctor.surname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const addDoctor = async (newDoctor: Omit<Doctor, "id">) => {
        setIsAddingDoctor(true)
        setFormMessage({ type: null, text: "" })
        try {
            console.log("➕ Adding doctor:", newDoctor)
            await addDoctorRequest(newDoctor)
            const updatedList = await getDoctors()
            console.log("✅ Doctors updated after add:", updatedList)
            setDoctors(updatedList)
            setFormMessage({ type: "success", text: "Doktor bol úspešne pridaný!" })
            // Close dialog after 1.5 seconds to show success message
            setTimeout(() => {
                setIsAddDoctorOpen(false)
                setFormMessage({ type: null, text: "" })
            }, 1500)
        } catch (error) {
            console.error("❌ Failed to add doctor:", error)
            setFormMessage({ type: "error", text: "Nepodarilo sa pridať doktora. Skúste to znovu." })
        } finally {
            setIsAddingDoctor(false)
        }
    }

    const handleDelete = async (id: number) => {
        setDeletingDoctorId(id)
        setDeleteMessage({ type: null, text: "" })
        try {
            console.log("🗑️ Deleting doctor with ID:", id)
            await deleteDoctorRequest(id)
            const updatedList = await getDoctors()
            console.log("✅ Doctors updated after delete:", updatedList)
            setDoctors(updatedList)
            setDeleteMessage({ type: "success", text: "Doktor bol úspešne vymazaný!" })
            // Clear success message after 3 seconds
            setTimeout(() => {
                setDeleteMessage({ type: null, text: "" })
            }, 3000)
        } catch (error) {
            console.error("❌ Failed to delete doctor:", error)
            setDeleteMessage({ type: "error", text: "Nepodarilo sa vymazať doktora. Skúste to znovu." })
            // Clear error message after 5 seconds
            setTimeout(() => {
                setDeleteMessage({ type: null, text: "" })
            }, 5000)
        } finally {
            setDeletingDoctorId(null)
        }
    }

    return (
        <div className="flex-1 w-full p-6 lg:p-8">
            <div className="space-y-6">
                <div className="flex flex-col space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Doktori</h1>
                    <p className="text-muted-foreground">Spravuj zoznam doktorov.</p>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Hľadaj doktorov..."
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
                        open={isAddDoctorOpen}
                        onOpenChange={(open) => {
                            setIsAddDoctorOpen(open)
                            if (open) {
                                setFormMessage({ type: null, text: "" })
                            }
                        }}
                    >
                        <DialogTrigger asChild>
                            <Button className="shrink-0">
                                <Plus className="mr-2 h-4 w-4" />
                                Pridaj Doktora
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[525px]">
                            <DialogHeader>
                                <DialogTitle>Pridaj nového doktora</DialogTitle>
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
                                    const newDoctor = {
                                        name: formData.get("name") as string,
                                        surname: formData.get("surname") as string,
                                        email: formData.get("email") as string,
                                    }
                                    addDoctor(newDoctor)
                                }}
                            >
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">
                                            Meno
                                        </Label>
                                        <Input id="name" name="name" className="col-span-3" required disabled={isAddingDoctor} />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="surname" className="text-right">
                                            Priezvisko
                                        </Label>
                                        <Input id="surname" name="surname" className="col-span-3" required disabled={isAddingDoctor} />
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
                                            disabled={isAddingDoctor}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsAddDoctorOpen(false)}
                                        disabled={isAddingDoctor}
                                    >
                                        Zruš
                                    </Button>
                                    <Button type="submit" disabled={isAddingDoctor}>
                                        {isAddingDoctor ? "Pridávam..." : "Ulož Doktora"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Zoznam doktorov</CardTitle>
                        <CardDescription>Prehľad všetkých registrovaných doktorov</CardDescription>
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
                                            Načítavam doktorov...
                                        </TableCell>
                                    </TableRow>
                                ) : filteredDoctors.length > 0 ? (
                                    filteredDoctors.map((doctor) => (
                                        <TableRow key={doctor.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={`/placeholder.svg`} alt={`${doctor.name} ${doctor.surname}`} />
                                                        <AvatarFallback>{(doctor.name[0] + doctor.surname[0]).toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        {doctor.name} {doctor.surname}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{doctor.email}</TableCell>
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
                                                            onClick={() => handleDelete(doctor.id)}
                                                            disabled={deletingDoctorId === doctor.id}
                                                        >
                                                            <Trash className="mr-2 h-4 w-4" />
                                                            <span>{deletingDoctorId === doctor.id ? "Mažem..." : "Vymaž"}</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center h-24">
                                            Žiadni doktori sa nenašli.
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
