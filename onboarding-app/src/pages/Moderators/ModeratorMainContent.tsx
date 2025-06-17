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
import {
    getModerators,
    getMyModerators,
    addModerator as addModeratorRequest,
    deleteModerator as deleteModeratorRequest,
    type Moderator,
} from "@/api/moderatorApi"

export default function TechniciansMainContent() {
    const [technicians, setTechnicians] = useState<Moderator[]>([])
    const [loading, setLoading] = useState(true)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const { roleId } = useAuth()
    const navigate = useNavigate()
    const [isAddingTechnician, setIsAddingTechnician] = useState(false)
    const [formMessage, setFormMessage] = useState<{ type: "success" | "error" | null; text: string }>({
        type: null,
        text: "",
    })
    const [deletingTechnicianId, setDeletingTechnicianId] = useState<number | null>(null)
    const [deleteMessage, setDeleteMessage] = useState<{ type: "success" | "error" | null; text: string }>({
        type: null,
        text: "",
    })

    useEffect(() => {
        if (![3, 4].includes(roleId ?? 0)) {
            navigate("/")
            return
        }

        const fetchTechnicians = async () => {
            try {
                console.log("🔄 Fetching technicians...")
                const data = roleId === 3 ? await getMyModerators() : await getModerators()
                console.log("✅ Technicians loaded:", data)
                setTechnicians(data)
            } catch (err) {
                console.error("❌ Failed to load technicians:", err)
                setTechnicians([])
            } finally {
                setLoading(false)
            }
        }
        fetchTechnicians()
    }, [roleId, navigate])

    if (![3, 4].includes(roleId ?? 0)) return null

    const filteredTechnicians = (technicians || []).filter(
        (tech) =>
            `${tech.name} ${tech.surname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tech.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const addTechnician = async (newTech: Omit<Moderator, "id">) => {
        setIsAddingTechnician(true)
        setFormMessage({ type: null, text: "" })
        try {
            console.log("➕ Adding technician:", newTech)
            if (roleId === 3) {
                await import("@/api/moderatorApi").then(({ addUser }) => addUser(newTech))
            } else {
                await addModeratorRequest(newTech)
            }

            const updated = roleId === 3 ? await getMyModerators() : await getModerators()
            console.log("✅ Technicians updated after add:", updated)
            setTechnicians(updated)
            setFormMessage({ type: "success", text: "Technik bol úspešne pridaný!" })
            // Close dialog after 1.5 seconds to show success message
            setTimeout(() => {
                setIsAddOpen(false)
                setFormMessage({ type: null, text: "" })
            }, 1500)
        } catch (err) {
            console.error("❌ Failed to add technician/user:", err)
            setFormMessage({ type: "error", text: "Nepodarilo sa pridať technika. Skúste to znovu." })
        } finally {
            setIsAddingTechnician(false)
        }
    }

    const handleDelete = async (id: number) => {
        setDeletingTechnicianId(id)
        setDeleteMessage({ type: null, text: "" })
        try {
            await deleteModeratorRequest(id)
            const updated = await getModerators()
            setTechnicians(updated)
            setDeleteMessage({ type: "success", text: "Technik bol úspešne vymazaný!" })
            setTimeout(() => {
                setDeleteMessage({ type: null, text: "" })
            }, 3000)
        } catch (err) {
            console.error("❌ Failed to delete technician:", err)
            setDeleteMessage({ type: "error", text: "Nepodarilo sa vymazať technika. Skúste to znovu." })
            // Clear error message after 5 seconds
            setTimeout(() => {
                setDeleteMessage({ type: null, text: "" })
            }, 5000)
        } finally {
            setDeletingTechnicianId(null)
        }
    }

    return (
        <div className="flex-1 p-6 lg:p-8">
            <div className="space-y-6">
                <div className="flex flex-col space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Technici</h1>
                    <p className="text-muted-foreground">Spravuj zoznam technikov.</p>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Hľadaj technikov..."
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
                                Pridaj Technika
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[525px]">
                            <DialogHeader>
                                <DialogTitle>Pridaj nového technika</DialogTitle>
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
                                    const newTech = {
                                        name: formData.get("name") as string,
                                        surname: formData.get("surname") as string,
                                        email: formData.get("email") as string,
                                    }
                                    addTechnician(newTech)
                                }}
                            >
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">
                                            Meno
                                        </Label>
                                        <Input id="name" name="name" className="col-span-3" required disabled={isAddingTechnician} />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="surname" className="text-right">
                                            Priezvisko
                                        </Label>
                                        <Input id="surname" name="surname" className="col-span-3" required disabled={isAddingTechnician} />
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
                                            disabled={isAddingTechnician}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsAddOpen(false)}
                                        disabled={isAddingTechnician}
                                    >
                                        Zruš
                                    </Button>
                                    <Button type="submit" disabled={isAddingTechnician}>
                                        {isAddingTechnician ? "Pridávam..." : "Ulož Technika"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Zoznam technikov</CardTitle>
                        <CardDescription>Prehľad všetkých registrovaných technikov</CardDescription>
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
                                            Načítavam technikov...
                                        </TableCell>
                                    </TableRow>
                                ) : filteredTechnicians.length > 0 ? (
                                    filteredTechnicians.map((tech, index) => (
                                        <TableRow key={tech.id || index}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={`/placeholder.svg`} alt={`${tech.name} ${tech.surname}`} />
                                                        <AvatarFallback>{(tech.name[0] + tech.surname[0]).toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        {tech.name} {tech.surname}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{tech.email}</TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        {roleId === 3 ? (
                                                            <DropdownMenuItem disabled className="opacity-50 cursor-not-allowed">
                                                                <Trash className="mr-2 h-4 w-4" />
                                                                <div className="flex flex-col">
                                                                    <span>Vymaž</span>
                                                                    <small className="text-xs text-muted-foreground">Kontaktuj admina</small>
                                                                </div>
                                                            </DropdownMenuItem>
                                                        ) : (
                                                            <DropdownMenuItem
                                                                className="text-red-600"
                                                                onClick={() => handleDelete(tech.id)}
                                                                disabled={deletingTechnicianId === tech.id}
                                                            >
                                                                <Trash className="mr-2 h-4 w-4" />
                                                                <span>{deletingTechnicianId === tech.id ? "Mažem..." : "Vymaž"}</span>
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center h-24">
                                            Technik nebol nájdený.
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
