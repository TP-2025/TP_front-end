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
import { getModerators, getMyModerators, addModerator as addModeratorRequest, deleteModerator as deleteModeratorRequest, Moderator } from "@/api/moderatorApi"

export default function ModeratorsMainContent() {
    const [moderators, setModerators] = useState<Moderator[]>([])
    const [loading, setLoading] = useState(true)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const { roleId } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (![3, 4].includes(roleId ?? 0)) {
            navigate("/")
            return
        }

        console.log("📡 Fetching moderators...")

        const fetchModerators = async () => {
            try {
                const data = roleId === 3 ? await getMyModerators() : await getModerators()
                console.log("✅ Moderators received from API:", data)
                setModerators(data)
            } catch (err) {
                console.error("❌ Failed to load moderators:", err)
                setModerators([])
            } finally {
                setLoading(false)
            }
        }
        fetchModerators()

    }, [roleId, navigate])


    if (![3, 4].includes(roleId ?? 0)) return null


    const filteredModerators = (moderators || []).filter((mod) =>
        `${mod.name} ${mod.surname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mod.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const addModerator = async (newMod: Omit<Moderator, "id">) => {
        try {
            if (roleId === 3) {
                // Doctor adds user
                await import("@/api/moderatorApi").then(({ addUser }) => addUser(newMod))
            } else {
                // Admin adds moderator
                await addModeratorRequest(newMod)
            }

            const updated = roleId === 3 ? await getMyModerators() : await getModerators()
            setModerators(updated)
            setIsAddOpen(false)
        } catch (err) {
            console.error("❌ Failed to add moderator/user:", err)
        }
    }


    const handleDelete = async (id: number) => {
        try {
            await deleteModeratorRequest(id)
            const updated = await getModerators()
            setModerators(updated)
        } catch (err) {
            console.error("\u274C Failed to delete moderator:", err)
        }
    }

    return (
        <div className="flex-1 p-6 lg:p-8">
            <div className="space-y-6">
                <div className="flex flex-col space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Moderátori</h1>
                    <p className="text-muted-foreground">Spravuj zoznam moderátorov.</p>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Hľadaj moderátorov..."
                            className="w-full pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button className="shrink-0">
                                <Plus className="mr-2 h-4 w-4" />
                                Pridaj Moderátora
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[525px]">
                            <DialogHeader>
                                <DialogTitle>Pridaj nového moderátora</DialogTitle>
                                <DialogDescription>Vyplň údaje</DialogDescription>
                            </DialogHeader>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault()
                                    const form = e.currentTarget as HTMLFormElement
                                    const formData = new FormData(form)
                                    const newMod = {
                                        name: formData.get("name") as string,
                                        surname: formData.get("surname") as string,
                                        email: formData.get("email") as string,
                                    }
                                    addModerator(newMod)
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
                                    <Button type="submit">Ulož Moderátora</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Zoznam moderátorov</CardTitle>
                        <CardDescription>Prehľad všetkých registrovaných moderátorov</CardDescription>
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
                                            Načítavam moderátorov...
                                        </TableCell>
                                    </TableRow>
                                ) : filteredModerators.length > 0 ? (
                                    filteredModerators.map((mod, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={`/placeholder.svg`} alt={`${mod.name} ${mod.surname}`} />
                                                        <AvatarFallback>{(mod.name[0] + mod.surname[0]).toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <div>{mod.name} {mod.surname}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{mod.email}</TableCell>
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
                                                        <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(mod.id)}>
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
                                            Nenašiel sa moderátor
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
