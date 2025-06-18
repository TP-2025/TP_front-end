"use client"

import type React from "react"
import { useState } from "react"
import { Plus, Camera, Target, BarChart3, User, Lock, Eye, EyeOff, Calendar, Stethoscope, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { addCamera, addAccessory, addAnalysis, deleteCamera } from "@/api/settingsApi"
import { addDiagnosis, getDiagnoses, deleteDiagnosis } from "@/api/settingsApi"
import { toast } from "sonner"
import { useAuth } from "@/Security/authContext"
import { changePassword } from "@/api/settingsApi"
import { getCameras } from "@/api/settingsApi"
import { useEffect } from "react"

interface CameraItem {
    id: number
    name: string
    type: string
}

interface AccessoryItem {
    id: number
    name: string
    description: string
}

interface AnalysisItem {
    id: number
    name: string
    description: string
}

interface DiagnosisItem {
    id: number
    name: string
}

export default function Settings() {
    const [activeTab, setActiveTab] = useState("personal")
    const { user } = useAuth()

    const [cameraForm, setCameraForm] = useState({ name: "", type: "" })
    const [accessoryForm, setAccessoryForm] = useState({ name: "", description: "" })
    const [analysisForm, setAnalysisForm] = useState({ name: "", description: "" })
    const [diagnosisForm, setDiagnosisForm] = useState({ name: "" })

    // Lists of added items
    const [cameras, setCameras] = useState<CameraItem[]>([])
    const [accessories, setAccessories] = useState<AccessoryItem[]>([])
    const [analyses, setAnalyses] = useState<AnalysisItem[]>([])
    const [diagnoses, setDiagnoses] = useState<DiagnosisItem[]>([])




    useEffect(() => {
        fetchCameras()
        fetchDiagnoses() // 👈 new
    }, [])

    const fetchCameras = async () => {
        try {
            const data = await getCameras()
            setCameras(data)
        } catch (error) {
            console.error("Error fetching cameras:", error)
            toast.error("Nepodarilo sa načítať kamery")
        }
    }

    const fetchDiagnoses = async () => {
        try {
            const data = await getDiagnoses()
            setDiagnoses(data)
        } catch (error) {
            console.error("Error fetching diagnoses:", error)
            toast.error("Nepodarilo sa načítať diagnózy")
        }
    }


    // Personal info form state
    const [personalForm, setPersonalForm] = useState({
        name: "",
        surname: "",
        birthDate: undefined as Date | undefined,
        gender: "",
    })

    // Password form state with visibility toggles
    const [passwordForm, setPasswordForm] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    })

    const [passwordVisibility, setPasswordVisibility] = useState({
        oldPassword: false,
        newPassword: false,
        confirmPassword: false,
    })

    const [datePickerOpen, setDatePickerOpen] = useState(false)

    const handleAddCamera = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!cameraForm.name.trim() || !cameraForm.type.trim()) return

        try {
            await addCamera(cameraForm.name, cameraForm.type)
            await fetchCameras()
            toast.success("Zariadenie bolo úspešne pridané")
            setCameraForm({ name: "", type: "" })
        } catch (error) {
            console.error("Add device error:", error)
            toast.error("Nepodarilo sa pridať zariadenie")
        }
    }

    const handleDeleteCamera = async (id: number) => {
        try {
            await deleteCamera(id)
            await fetchCameras() // refresh list from backend
            toast.success("Kamera bola vymazaná")
        } catch (error) {
            console.error("Delete camera error:", error)
            toast.error("Nepodarilo sa vymazať kameru")
        }
    }

    const handleAddAccessory = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!accessoryForm.name.trim()) return
        try {
            await addAccessory(accessoryForm.name)
            const newAccessory: AccessoryItem = {
                id: Date.now(),
                name: accessoryForm.name,
                description: accessoryForm.description,
            }
            setAccessories((prev) => [...prev, newAccessory])
            toast.success("Zariadenie bolo úspešne pridané")
            setAccessoryForm({ name: "", description: "" })
        } catch (error) {
            toast.error("Nepodarilo sa pridať zariadenie")
        }
    }

    const handleAddAnalysis = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!analysisForm.name.trim()) return
        try {
            await addAnalysis(analysisForm.name)
            const newAnalysis: AnalysisItem = {
                id: Date.now(),
                name: analysisForm.name,
                description: analysisForm.description,
            }
            setAnalyses((prev) => [...prev, newAnalysis])
            toast.success("Analýza bola úspešne pridaná")
            setAnalysisForm({ name: "", description: "" })
        } catch (error) {
            toast.error("Nepodarilo sa pridať analýzu")
        }
    }

    const handleAddDiagnosis = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!diagnosisForm.name.trim()) return
        try {
            await addDiagnosis(diagnosisForm.name)
            await fetchDiagnoses()
            toast.success("Diagnóza bola úspešne pridaná")
            setDiagnosisForm({ name: "" })
        } catch (error) {
            toast.error("Nepodarilo sa pridať diagnózu")
        }
    }


    const handleDeleteAccessory = (id: number) => {
        setAccessories((prev) => prev.filter((accessory) => accessory.id !== id))
        toast.success("Zariadenie bolo vymazané")
    }

    const handleDeleteAnalysis = (id: number) => {
        setAnalyses((prev) => prev.filter((analysis) => analysis.id !== id))
        toast.success("Analýza bola vymazaná")
    }

    const handleDeleteDiagnosis = async (id: number) => {
        try {
            await deleteDiagnosis(id)
            await fetchDiagnoses()
            toast.success("Diagnóza bola vymazaná")
        } catch (error) {
            toast.error("Nepodarilo sa vymazať diagnózu")
        }
    }

    const handlePersonalInfoUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        const form = e.currentTarget as HTMLFormElement
        const formData = new FormData(form)

        const personalData = {
            name: formData.get("name") as string,
            surname: formData.get("surname") as string,
            birthDate: personalForm.birthDate?.toISOString().split("T")[0] || "",
            gender: personalForm.gender,
        }

        try {
            console.log("Personal data to update:", personalData)
            // TODO: Add API call to update personal info
            // await updatePersonalInfo(personalData)
            toast.success("Osobné údaje boli úspešne aktualizované")
        } catch (error) {
            toast.error("Nepodarilo sa aktualizovať osobné údaje")
        }
    }

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault()

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error("Nové heslá sa nezhodujú")
            return
        }

        if (passwordForm.newPassword.length < 6) {
            toast.error("Nové heslo musí mať aspoň 6 znakov")
            return
        }

        try {
            if (!user?.email) {
                toast.error("Nie je možné získať email používateľa")
                return
            }

            // Send password change request
            await changePassword({
                email: user.email,
                old_password: passwordForm.oldPassword,
                new_password: passwordForm.newPassword,
            })

            toast.success("Heslo bolo úspešne zmenené")
            setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" })
        } catch (error: any) {
            console.error("Password change error:", error)

            const backendCode = error?.response?.data?.code

            if (backendCode === "old_password_is_invalid") {
                toast.error("Staré heslo je nesprávne")
            } else if (backendCode === "password_change_failed") {
                toast.error("Nepodarilo sa zmeniť heslo. Skúste znova neskôr.")
            } else if (error?.response?.status === 403) {
                toast.error("Nemáte oprávnenie zmeniť heslo")
            } else {
                toast.error("Neznáma chyba pri zmene hesla")
            }
        }
    }


    const togglePasswordVisibility = (field: keyof typeof passwordVisibility) => {
        setPasswordVisibility((prev) => ({
            ...prev,
            [field]: !prev[field],
        }))
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Nastavenia</h1>
                <p className="text-muted-foreground mt-2">Spravujte svoje osobné údaje, heslo a systémové nastavenia</p>
            </div>

            <div className="mb-6">
                <div className="flex flex-wrap space-x-1 bg-muted p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab("personal")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            activeTab === "personal"
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        <User className="w-4 h-4" />
                        Osobné údaje
                    </button>
                    <button
                        onClick={() => setActiveTab("password")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            activeTab === "password"
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        <Lock className="w-4 h-4" />
                        Zmena hesla
                    </button>
                    <button
                        onClick={() => setActiveTab("cameras")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            activeTab === "cameras"
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        <Camera className="w-4 h-4" />
                        Kamery
                    </button>
                    <button
                        onClick={() => setActiveTab("accessories")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            activeTab === "accessories"
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        <Target className="w-4 h-4" />
                        Prídavné zariadenia
                    </button>
                    <button
                        onClick={() => setActiveTab("analyses")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            activeTab === "analyses"
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        <BarChart3 className="w-4 h-4" />
                        Analýzy
                    </button>
                    <button
                        onClick={() => setActiveTab("diagnosis")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            activeTab === "diagnosis"
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        <Stethoscope className="w-4 h-4" />
                        Diagnózy
                    </button>
                </div>
            </div>

            {activeTab === "personal" && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Osobné údaje
                        </CardTitle>
                        <CardDescription>Upravte svoje osobné informácie</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handlePersonalInfoUpdate} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Meno *</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        placeholder="Vaše meno"
                                        value={personalForm.name}
                                        onChange={(e) => setPersonalForm((prev) => ({ ...prev, name: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="surname">Priezvisko *</Label>
                                    <Input
                                        id="surname"
                                        name="surname"
                                        placeholder="Vaše priezvisko"
                                        value={personalForm.surname}
                                        onChange={(e) => setPersonalForm((prev) => ({ ...prev, surname: e.target.value }))}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Dátum narodenia</Label>
                                    <div className="relative">
                                        <Input
                                            type="date"
                                            value={personalForm.birthDate ? format(personalForm.birthDate, "yyyy-MM-dd") : ""}
                                            onChange={(e) => {
                                                const date = e.target.value ? new Date(e.target.value) : undefined
                                                setPersonalForm((prev) => ({ ...prev, birthDate: date }))
                                            }}
                                            className="pr-10"
                                        />
                                        <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                >
                                                    <Calendar className="h-4 w-4" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <CalendarComponent
                                                    mode="single"
                                                    selected={personalForm.birthDate}
                                                    onSelect={(date) => {
                                                        setPersonalForm((prev) => ({ ...prev, birthDate: date }))
                                                        setDatePickerOpen(false)
                                                    }}
                                                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="gender">Pohlavie</Label>
                                    <Select
                                        value={personalForm.gender}
                                        onValueChange={(value) => setPersonalForm((prev) => ({ ...prev, gender: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Vyberte pohlavie" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">Muž</SelectItem>
                                            <SelectItem value="female">Žena</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <Button type="submit" className="w-full">
                                Uložiť zmeny
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            {activeTab === "password" && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lock className="w-5 h-5" />
                            Zmena hesla
                        </CardTitle>
                        <CardDescription>Zmeňte svoje prihlasovacie heslo</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="old-password">Staré heslo *</Label>
                                <div className="relative">
                                    <Input
                                        id="old-password"
                                        type={passwordVisibility.oldPassword ? "text" : "password"}
                                        placeholder="Zadajte staré heslo"
                                        value={passwordForm.oldPassword}
                                        onChange={(e) => setPasswordForm((prev) => ({ ...prev, oldPassword: e.target.value }))}
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => togglePasswordVisibility("oldPassword")}
                                    >
                                        {passwordVisibility.oldPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-password">Nové heslo *</Label>
                                <div className="relative">
                                    <Input
                                        id="new-password"
                                        type={passwordVisibility.newPassword ? "text" : "password"}
                                        placeholder="Zadajte nové heslo (min. 6 znakov)"
                                        value={passwordForm.newPassword}
                                        onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                                        required
                                        minLength={6}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => togglePasswordVisibility("newPassword")}
                                    >
                                        {passwordVisibility.newPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Potvrďte nové heslo *</Label>
                                <div className="relative">
                                    <Input
                                        id="confirm-password"
                                        type={passwordVisibility.confirmPassword ? "text" : "password"}
                                        placeholder="Zadajte nové heslo znovu"
                                        value={passwordForm.confirmPassword}
                                        onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                                        required
                                        minLength={6}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => togglePasswordVisibility("confirmPassword")}
                                    >
                                        {passwordVisibility.confirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                            {passwordForm.newPassword &&
                                passwordForm.confirmPassword &&
                                passwordForm.newPassword !== passwordForm.confirmPassword && (
                                    <p className="text-sm text-red-600">Heslá sa nezhodujú</p>
                                )}
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={
                                    passwordForm.newPassword !== passwordForm.confirmPassword ||
                                    !passwordForm.oldPassword ||
                                    !passwordForm.newPassword ||
                                    !passwordForm.confirmPassword
                                }
                            >
                                Zmeniť heslo
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            {activeTab === "cameras" && (
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Camera className="w-5 h-5" />
                                Pridať novú kameru
                            </CardTitle>
                            <CardDescription>Pridajte nové kamerové zariadenie do systému</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleAddCamera} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="camera-name">Názov kamery *</Label>
                                        <Input
                                            id="camera-name"
                                            placeholder="napr. Hlavná kamera"
                                            value={cameraForm.name}
                                            onChange={(e) => setCameraForm((prev) => ({ ...prev, name: e.target.value }))}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="camera-type">Typ kamery *</Label>
                                        <Input
                                            id="camera-type"
                                            placeholder="napr. Fundus Camera"
                                            value={cameraForm.type}
                                            onChange={(e) => setCameraForm((prev) => ({ ...prev, type: e.target.value }))}
                                            required
                                        />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Pridať kameru
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Zoznam kamier</CardTitle>
                            <CardDescription>Prehľad všetkých pridaných kamier</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {cameras.length === 0 ? (
                                <p className="text-muted-foreground text-center py-4">Žiadne kamery neboli pridané</p>
                            ) : (
                                <div className="space-y-2">
                                    {cameras.map((camera) => (
                                        <div
                                            key={camera.id}
                                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                                        >
                                            <div>
                                                <p className="font-medium">{camera.name}</p>
                                                <p className="text-sm text-muted-foreground">{camera.type}</p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteCamera(camera.id)}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}

            {activeTab === "accessories" && (
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="w-5 h-5" />
                                Pridať nové prídavné zariadenie
                            </CardTitle>
                            <CardDescription>Pridajte nové prídavné zariadenie pre vaše kamery</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleAddAccessory} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="accessory-name">Názov zariadenia *</Label>
                                    <Input
                                        id="accessory-name"
                                        placeholder="napr. Infračervený modul"
                                        value={accessoryForm.name}
                                        onChange={(e) => setAccessoryForm((prev) => ({ ...prev, name: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="accessory-description">Popis</Label>
                                    <Textarea
                                        id="accessory-description"
                                        placeholder="Voliteľný popis zariadenia..."
                                        value={accessoryForm.description}
                                        onChange={(e) => setAccessoryForm((prev) => ({ ...prev, description: e.target.value }))}
                                        rows={3}
                                    />
                                </div>
                                <Button type="submit" className="w-full">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Pridať zariadenie
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Zoznam prídavných zariadení</CardTitle>
                            <CardDescription>Prehľad všetkých pridaných zariadení</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {accessories.length === 0 ? (
                                <p className="text-muted-foreground text-center py-4">Žiadne zariadenia neboli pridané</p>
                            ) : (
                                <div className="space-y-2">
                                    {accessories.map((accessory) => (
                                        <div
                                            key={accessory.id}
                                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                                        >
                                            <div className="flex-1">
                                                <p className="font-medium">{accessory.name}</p>
                                                {accessory.description && (
                                                    <p className="text-sm text-muted-foreground">{accessory.description}</p>
                                                )}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteAccessory(accessory.id)}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}

            {activeTab === "analyses" && (
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="w-5 h-5" />
                                Pridať nový typ analýzy
                            </CardTitle>
                            <CardDescription>Pridajte nový typ analýzy do systému</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleAddAnalysis} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="analysis-name">Názov analýzy *</Label>
                                    <Input
                                        id="analysis-name"
                                        placeholder="napr. Počítanie buniek"
                                        value={analysisForm.name}
                                        onChange={(e) => setAnalysisForm((prev) => ({ ...prev, name: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="analysis-description">Popis</Label>
                                    <Textarea
                                        id="analysis-description"
                                        placeholder="Popíšte, čo táto analýza robí..."
                                        value={analysisForm.description}
                                        onChange={(e) => setAnalysisForm((prev) => ({ ...prev, description: e.target.value }))}
                                        rows={3}
                                    />
                                </div>
                                <Button type="submit" className="w-full">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Pridať analýzu
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Zoznam analýz</CardTitle>
                            <CardDescription>Prehľad všetkých pridaných analýz</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {analyses.length === 0 ? (
                                <p className="text-muted-foreground text-center py-4">Žiadne analýzy neboli pridané</p>
                            ) : (
                                <div className="space-y-2">
                                    {analyses.map((analysis) => (
                                        <div
                                            key={analysis.id}
                                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                                        >
                                            <div className="flex-1">
                                                <p className="font-medium">{analysis.name}</p>
                                                {analysis.description && (
                                                    <p className="text-sm text-muted-foreground">{analysis.description}</p>
                                                )}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteAnalysis(analysis.id)}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}

            {activeTab === "diagnosis" && (
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Stethoscope className="w-5 h-5" />
                                Pridať novú diagnózu
                            </CardTitle>
                            <CardDescription>Pridajte nový typ diagnózy do systému</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleAddDiagnosis} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="diagnosis-name">Názov diagnózy *</Label>
                                    <Input
                                        id="diagnosis-name"
                                        placeholder="napr. Diabetická retinopatia"
                                        value={diagnosisForm.name}
                                        onChange={(e) => setDiagnosisForm((prev) => ({ ...prev, name: e.target.value }))}
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Pridať diagnózu
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Zoznam diagnóz</CardTitle>
                            <CardDescription>Prehľad všetkých pridaných diagnóz</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {diagnoses.length === 0 ? (
                                <p className="text-muted-foreground text-center py-4">Žiadne diagnózy neboli pridané</p>
                            ) : (
                                <div className="space-y-2">
                                    {diagnoses.map((diagnosis) => (
                                        <div
                                            key={diagnosis.id}
                                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                                        >
                                            <div>
                                                <p className="font-medium">{diagnosis.name}</p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteDiagnosis(diagnosis.id)}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
