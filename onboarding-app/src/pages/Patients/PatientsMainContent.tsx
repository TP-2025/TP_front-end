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
import { getDoctors, getAllDoctors, type Doctor } from "@/api/doctorApi"
import {
    addPatient as addPatientRequest,
    getPatients,
    getMyPatients,
    deletePatient,
    type Patient
} from "@/api/patientApi"

export default function PacientsMainContent() {
    const [patients, setPatients] = useState<Patient[]>([])
    const [doctors, setDoctors] = useState<Doctor[]>([])
    const [loading, setLoading] = useState(true)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
    const [doctorSearch, setDoctorSearch] = useState("")
    const [showDoctorSuggestions, setShowDoctorSuggestions] = useState(false)
    const { roleId, user } = useAuth()
    const navigate = useNavigate()
    const [isAddingPatient, setIsAddingPatient] = useState(false)
    const [formMessage, setFormMessage] = useState<{ type: "success" | "error" | null; text: string }>({
        type: null,
        text: "",
    })
    const [deletingPatientId, setDeletingPatientId] = useState<number | null>(null)
    const [deleteMessage, setDeleteMessage] = useState<{ type: "success" | "error" | null; text: string }>({
        type: null,
        text: "",
    })

    useEffect(() => {
        if (![2, 3, 4].includes(roleId ?? 0)) {
            navigate("/")
            return
        }

        setLoading(true)
        const fetchData = async () => {
            try {
                console.log("🔄 Fetching patients and doctors...")
                let patientsData = []
                let doctorsData: Doctor[] = []

                if (roleId === 2 || roleId === 3) {
                    patientsData = await getMyPatients()
                    if (roleId === 2) {
                        doctorsData = await getAllDoctors()
                    }
                } else {
                    ;[doctorsData, patientsData] = await Promise.all([getDoctors(), getPatients()])
                }

                console.log("✅ Data loaded:", { patients: patientsData, doctors: doctorsData })
                setDoctors(doctorsData)
                setPatients(patientsData)
            } catch (err) {
                console.error("❌ Failed to fetch data:", err)
                setDoctors([])
                setPatients([])
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [roleId, navigate])

    if (![2, 3, 4].includes(roleId ?? 0)) return null

    const filteredPatients = patients.filter(
        (p) =>
            `${p.name} ${p.surname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const filteredDoctors = doctors
        .filter(
            (doctor) =>
                doctorSearch.length > 0 &&
                (doctor.name.toLowerCase().startsWith(doctorSearch.toLowerCase()) ||
                    doctor.surname.toLowerCase().startsWith(doctorSearch.toLowerCase())),
        )
        .slice(0, 5)

    const addPatient = async (newP: Omit<Patient, "id">) => {
        setIsAddingPatient(true)
        setFormMessage({ type: null, text: "" })
        try {
            console.log("➕ Adding patient:", newP)
            await addPatientRequest(newP)
            const updated = roleId === 2 || roleId === 3 ? await getMyPatients() : await getPatients()
            console.log("✅ Patients updated after add:", updated)
            setPatients(updated)
            setFormMessage({ type: "success", text: "Pacient bol úspešne pridaný!" })
            setTimeout(() => {
                setIsAddOpen(false)
                setSelectedDoctor(null)
                setDoctorSearch("")
                setFormMessage({ type: null, text: "" })
            }, 1500)
        } catch (err) {
            console.error("❌ Failed to add patient:", err)
            setFormMessage({ type: "error", text: "Nepodarilo sa pridať pacienta. Skúste to znovu." })
        } finally {
            setIsAddingPatient(false)
        }
    }

    const deletePatientHandler = async (id: number) => {
        setDeletingPatientId(id)
        setDeleteMessage({ type: null, text: "" })

        try {
            console.log("🗑️ Deleting patient with ID:", id)

            if (roleId === 4) {
                await deletePatient(id)
            } else {
                console.log("Using removePatient for roleId:", roleId)
            }

            console.log("✅ Successfully deleted patient ID:", id)

            const updated = roleId === 2 || roleId === 3 ? await getMyPatients() : await getPatients()
            setPatients(updated)
            setDeleteMessage({ type: "success", text: "Pacient bol úspešne vymazaný!" })

            setTimeout(() => setDeleteMessage({ type: null, text: "" }), 3000)
        } catch (err) {
            console.error("❌ Failed to delete patient:", err)
            setDeleteMessage({ type: "error", text: "Nepodarilo sa vymazať pacienta. Skúste to znovu." })
            setTimeout(() => setDeleteMessage({ type: null, text: "" }), 5000)
        } finally {
            setDeletingPatientId(null)
        }
    }



    return (
        <div className="flex-1 p-6 lg:p-8">
            <div className="space-y-6">
                <div className="flex flex-col space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Pacienti</h1>
                    <p className="text-muted-foreground">Spravuj zoznam pacientov</p>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Hľadaj pacientov..."
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
                                setSelectedDoctor(null)
                                setDoctorSearch("")
                            }
                        }}
                    >
                        <DialogTrigger asChild>
                            <Button className="shrink-0">
                                <Plus className="mr-2 h-4 w-4" />
                                Pridaj Pacienta
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[525px]">
                            <DialogHeader>
                                <DialogTitle>Pridaj nového pacienta</DialogTitle>
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

                                    const formattedDate = formData.get("dateOfBirth") as string

                                    const newPatient: Omit<Patient, "id"> = {
                                        name: formData.get("name") as string,
                                        surname: formData.get("surname") as string,
                                        email: formData.get("email") as string,
                                        doctor_id: roleId === 3 ? Number(user?.id) : selectedDoctor?.id || 0,
                                        birth_date: formattedDate,
                                        sex: formData.get("sex") as string,
                                    }
                                    addPatient(newPatient)
                                }}
                            >
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">
                                            Meno
                                        </Label>
                                        <Input id="name" name="name" className="col-span-3" required disabled={isAddingPatient} />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="surname" className="text-right">
                                            Priezvisko
                                        </Label>
                                        <Input id="surname" name="surname" className="col-span-3" required disabled={isAddingPatient} />
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
                                            disabled={isAddingPatient}
                                        />
                                    </div>

                                    {roleId !== 3 && (
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="doctor" className="text-right">
                                                Doktor
                                            </Label>
                                            <div className="col-span-3 relative">
                                                <Input
                                                    id="doctor"
                                                    value={selectedDoctor ? `${selectedDoctor.name} ${selectedDoctor.surname}` : doctorSearch}
                                                    onChange={(e) => {
                                                        setDoctorSearch(e.target.value)
                                                        setSelectedDoctor(null)
                                                        setShowDoctorSuggestions(true)
                                                    }}
                                                    onFocus={() => setShowDoctorSuggestions(true)}
                                                    onBlur={() => setTimeout(() => setShowDoctorSuggestions(false), 200)}
                                                    placeholder="Začni písať meno doktora..."
                                                    disabled={isAddingPatient}
                                                />
                                                {showDoctorSuggestions && filteredDoctors.length > 0 && !isAddingPatient && (
                                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto">
                                                        {filteredDoctors.map((doctor) => (
                                                            <div
                                                                key={doctor.id}
                                                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                                                onClick={() => {
                                                                    setSelectedDoctor(doctor)
                                                                    setDoctorSearch("")
                                                                    setShowDoctorSuggestions(false)
                                                                }}
                                                            >
                                                                <div className="font-medium">
                                                                    {doctor.name} {doctor.surname}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="dateOfBirth" className="text-right">
                                            Dát. narodenia
                                        </Label>
                                        <Input
                                            id="dateOfBirth"
                                            name="dateOfBirth"
                                            type="date"
                                            className="col-span-3"
                                            required
                                            disabled={isAddingPatient}
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="sex" className="text-right">
                                            Pohlavie
                                        </Label>
                                        <select
                                            id="sex"
                                            name="sex"
                                            className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            required
                                            disabled={isAddingPatient}
                                        >
                                            <option value="">Vyber pohlavie</option>
                                            <option value="Muž">Muž</option>
                                            <option value="Žena">Žena</option>
                                        </select>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsAddOpen(false)}
                                        disabled={isAddingPatient}
                                    >
                                        Zruš
                                    </Button>
                                    <Button type="submit" disabled={isAddingPatient}>
                                        {isAddingPatient ? "Pridávam..." : "Ulož Pacienta"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Zoznam Pacientov</CardTitle>
                        <CardDescription>Prehľad všetkých registrovaných pacientov</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-1/6">Meno</TableHead>
                                    <TableHead className="w-1/6">Email</TableHead>
                                    <TableHead className="w-1/6">Dát. narodenia</TableHead>
                                    <TableHead className="w-1/6">Pohlavie</TableHead>
                                    <TableHead className="w-1/6 text-right">Akcie</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center h-24">
                                            Načítavam pacientov...
                                        </TableCell>
                                    </TableRow>
                                ) : filteredPatients.length > 0 ? (
                                    filteredPatients.map((p, idx) => (
                                        <TableRow key={p.id || idx}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src="/placeholder.svg" alt={p.name} />
                                                        <AvatarFallback>{p.name[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        {p.name} {p.surname}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{p.email}</TableCell>
                                            <TableCell>{p.birth_date}</TableCell>
                                            <TableCell>{p.sex}</TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        {[2, 3].includes(roleId ?? 0) ? (
                                                            <DropdownMenuItem
                                                                className="text-red-600"
                                                                onClick={() => deletePatientHandler(p.id)}
                                                                disabled={deletingPatientId === p.id}
                                                            >
                                                                <Trash className="mr-2 h-4 w-4" />
                                                                <span>{deletingPatientId === p.id ? "Mažem..." : "Vymaž"}</span>
                                                            </DropdownMenuItem>
                                                        ) : (
                                                            <DropdownMenuItem
                                                                className="text-red-600"
                                                                onClick={() => deletePatientHandler(p.id)}
                                                                disabled={deletingPatientId === p.id}
                                                            >
                                                                <Trash className="mr-2 h-4 w-4" />
                                                                <span>{deletingPatientId === p.id ? "Mažem..." : "Vymaž"}</span>
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center h-24">
                                            Pacient nebol nájdený.
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
