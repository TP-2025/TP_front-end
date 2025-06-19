"use client"

import type React from "react"
import { useState } from "react"
import { Plus, Camera, Target, BarChart3, User, Lock, Eye, EyeOff, Stethoscope, Trash2, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { format } from "date-fns"
import { addCamera, addAccessory, addAnalysis, deleteCamera } from "@/api/settingsApi"
import { addDiagnosis, getDiagnoses, deleteDiagnosis } from "@/api/settingsApi"
import { useAuth } from "@/Security/authContext"
import { changePassword } from "@/api/settingsApi"
import { getCameras } from "@/api/settingsApi"
import { useEffect } from "react"

import { getUserPersonalInfo } from "@/api/settingsApi"
import { sendPersonalData } from "@/api/settingsApi"



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

interface NotificationState {
    isOpen: boolean
    type: "success" | "error"
    title: string
    message: string
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

    // Loading states
    const [isLoadingCameras, setIsLoadingCameras] = useState(true)
    const [isLoadingDiagnoses, setIsLoadingDiagnoses] = useState(true)
    const [isAddingCamera, setIsAddingCamera] = useState(false)
    const [isAddingAccessory, setIsAddingAccessory] = useState(false)
    const [isAddingAnalysis, setIsAddingAnalysis] = useState(false)
    const [isAddingDiagnosis, setIsAddingDiagnosis] = useState(false)
    const [isUpdatingPersonal] = useState(false)
    const [isChangingPassword, setIsChangingPassword] = useState(false)
    const [deletingCameraId, setDeletingCameraId] = useState<number | null>(null)
    const [deletingAccessoryId, setDeletingAccessoryId] = useState<number | null>(null)
    const [deletingAnalysisId, setDeletingAnalysisId] = useState<number | null>(null)
    const [deletingDiagnosisId, setDeletingDiagnosisId] = useState<number | null>(null)

    // Add these new state variables after the existing loading states
    const [camerasError, setCamerasError] = useState<string | null>(null)
    const [diagnosesError, setDiagnosesError] = useState<string | null>(null)

    const [isLoadingPersonalInfo, setIsLoadingPersonalInfo] = useState(true)

    const [personalInfoError, setPersonalInfoError] = useState<string | null>(null)


    const [notification, setNotification] = useState<NotificationState>({
        isOpen: false,
        type: "success",
        title: "",
        message: "",
    })

    const showNotification = (type: "success" | "error", title: string, message: string) => {
        setNotification({
            isOpen: true,
            type,
            title,
            message,
        })
    }

    const closeNotification = () => {
        setNotification((prev) => ({ ...prev, isOpen: false }))
    }

    useEffect(() => {
        fetchCameras()
        fetchDiagnoses()
        fetchPersonalInfo()
    }, [])

    const fetchCameras = async () => {
        try {
            setIsLoadingCameras(true)
            setCamerasError(null)
            const data = await getCameras()
            setCameras(data)
        } catch (error) {
            console.error("Error fetching cameras:", error)
            setCamerasError("Nepodarilo sa načítať kamery")
        } finally {
            setIsLoadingCameras(false)
        }
    }

    const fetchDiagnoses = async () => {
        try {
            setIsLoadingDiagnoses(true)
            setDiagnosesError(null)
            const data = await getDiagnoses()
            setDiagnoses(data)
        } catch (error) {
            console.error("Error fetching diagnoses:", error)
            setDiagnosesError("Nepodarilo sa načítať diagnózy")
        } finally {
            setIsLoadingDiagnoses(false)
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

    const handleAddCamera = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!cameraForm.name.trim() || !cameraForm.type.trim()) return

        try {
            setIsAddingCamera(true)
            await addCamera(cameraForm.name, cameraForm.type)
            await fetchCameras()
            showNotification("success", "Úspech", "Zariadenie bolo úspešne pridané")
            setCameraForm({ name: "", type: "" })
        } catch (error) {
            console.error("Add device error:", error)
            showNotification("error", "Chyba", "Nepodarilo sa pridať zariadenie")
        } finally {
            setIsAddingCamera(false)
        }
    }

    const fetchPersonalInfo = async () => {
        try {
            setIsLoadingPersonalInfo(true)
            setPersonalInfoError(null)
            const data = await getUserPersonalInfo()

            setPersonalForm({
                name: data.name || "",
                surname: data.surname || "",
                birthDate: data.date ? new Date(data.date) : undefined,
                gender: data.sex || "",
            })
        } catch (error) {
            console.error("Error fetching personal info:", error)
            setPersonalInfoError("Nepodarilo sa načítať osobné údaje")
        } finally {
            setIsLoadingPersonalInfo(false)
        }
    }

    const handleDeleteCamera = async (id: number) => {
        try {
            setDeletingCameraId(id)
            await deleteCamera(id)
            await fetchCameras()
            showNotification("success", "Úspech", "Kamera bola vymazaná")
        } catch (error) {
            console.error("Delete camera error:", error)
            showNotification("error", "Chyba", "Nepodarilo sa vymazať kameru")
        } finally {
            setDeletingCameraId(null)
        }
    }

    const handleAddAccessory = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!accessoryForm.name.trim()) return

        try {
            setIsAddingAccessory(true)
            await addAccessory(accessoryForm.name)
            const newAccessory: AccessoryItem = {
                id: Date.now(),
                name: accessoryForm.name,
                description: accessoryForm.description,
            }
            setAccessories((prev) => [...prev, newAccessory])
            showNotification("success", "Úspech", "Zariadenie bolo úspešne pridané")
            setAccessoryForm({ name: "", description: "" })
        } catch (error) {
            showNotification("error", "Chyba", "Nepodarilo sa pridať zariadenie")
        } finally {
            setIsAddingAccessory(false)
        }
    }

    const handleAddAnalysis = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!analysisForm.name.trim()) return

        try {
            setIsAddingAnalysis(true)
            await addAnalysis(analysisForm.name)
            const newAnalysis: AnalysisItem = {
                id: Date.now(),
                name: analysisForm.name,
                description: analysisForm.description,
            }
            setAnalyses((prev) => [...prev, newAnalysis])
            showNotification("success", "Úspech", "Analýza bola úspešne pridaná")
            setAnalysisForm({ name: "", description: "" })
        } catch (error) {
            showNotification("error", "Chyba", "Nepodarilo sa pridať analýzu")
        } finally {
            setIsAddingAnalysis(false)
        }
    }

    const handleAddDiagnosis = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!diagnosisForm.name.trim()) return

        try {
            setIsAddingDiagnosis(true)
            await addDiagnosis(diagnosisForm.name)
            await fetchDiagnoses()
            showNotification("success", "Úspech", "Diagnóza bola úspešne pridaná")
            setDiagnosisForm({ name: "" })
        } catch (error) {
            showNotification("error", "Chyba", "Nepodarilo sa pridať diagnózu")
        } finally {
            setIsAddingDiagnosis(false)
        }
    }

    const handleDeleteAccessory = (id: number) => {
        setDeletingAccessoryId(id)
        setTimeout(() => {
            setAccessories((prev) => prev.filter((accessory) => accessory.id !== id))
            showNotification("success", "Úspech", "Zariadenie bolo vymazané")
            setDeletingAccessoryId(null)
        }, 500)
    }

    const handleDeleteAnalysis = (id: number) => {
        setDeletingAnalysisId(id)
        setTimeout(() => {
            setAnalyses((prev) => prev.filter((analysis) => analysis.id !== id))
            showNotification("success", "Úspech", "Analýza bola vymazaná")
            setDeletingAnalysisId(null)
        }, 500)
    }

    const handleDeleteDiagnosis = async (id: number) => {
        try {
            setDeletingDiagnosisId(id)
            await deleteDiagnosis(id)
            await fetchDiagnoses()
            showNotification("success", "Úspech", "Diagnóza bola vymazaná")
        } catch (error) {
            showNotification("error", "Chyba", "Nepodarilo sa vymazať diagnózu")
        } finally {
            setDeletingDiagnosisId(null)
        }
    }

    const handleSendPersonalInfo = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const payload = {
                name: personalForm.name,
                surname: personalForm.surname,
                sex: personalForm.gender || null,
                birth_date: personalForm.birthDate
                    ? format(personalForm.birthDate, "dd.MM.yyyy")
                    : null,
            }

            console.log("📤 Sending personal data:", payload)
            await sendPersonalData(payload)
            showNotification("success", "Úspech", "Údaje boli úspešne odoslané")
        } catch (err) {
            console.error("❌ Error sending personal data:", err)
            showNotification("error", "Chyba", "Nepodarilo sa odoslať údaje")
        }
    }


    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault()

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            showNotification("error", "Chyba", "Nové heslá sa nezhodujú")
            return
        }

        if (passwordForm.newPassword.length < 6) {
            showNotification("error", "Chyba", "Nové heslo musí mať aspoň 6 znakov")
            return
        }

        try {
            setIsChangingPassword(true)
            if (!user?.email) {
                showNotification("error", "Chyba", "Nie je možné získať email používateľa")
                return
            }

            await changePassword({
                email: user.email,
                old_password: passwordForm.oldPassword,
                new_password: passwordForm.newPassword,
            })

            showNotification("success", "Úspech", "Heslo bolo úspešne zmenené")
            setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" })
        } catch (error: any) {
            console.error("Password change error:", error)

            const backendCode = error?.response?.data?.code

            if (backendCode === "old_password_is_invalid") {
                showNotification("error", "Chyba", "Staré heslo je nesprávne")
            } else if (backendCode === "password_change_failed") {
                showNotification("error", "Chyba", "Nepodarilo sa zmeniť heslo. Skúste znova neskôr.")
            } else if (error?.response?.status === 403) {
                showNotification("error", "Chyba", "Nemáte oprávnenie zmeniť heslo")
            } else {
                showNotification("error", "Chyba", "Neznáma chyba pri zmene hesla")
            }
        } finally {
            setIsChangingPassword(false)
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

            {/* Notification Dialog */}
            <Dialog open={notification.isOpen} onOpenChange={closeNotification}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className={notification.type === "success" ? "text-green-600" : "text-red-600"}>
                            {notification.title}
                        </DialogTitle>
                        <DialogDescription>{notification.message}</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={closeNotification}>OK</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {activeTab === "personal" && (
                isLoadingPersonalInfo ? (
                    <div className="flex items-center justify-center py-6">
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        <span>Načítavam osobné údaje...</span>
                    </div>
                ) : personalInfoError ? (
                    <Card>
                        <CardContent className="text-center py-8">
                            <p className="text-red-600 mb-4">{personalInfoError}</p>
                            <Button variant="outline" onClick={fetchPersonalInfo}>
                                Skúsiť znovu
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Osobné údaje
                            </CardTitle>
                            <CardDescription>Upravte svoje osobné informácie</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSendPersonalInfo} className="space-y-4">
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
                                            disabled={isUpdatingPersonal}
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
                                            disabled={isUpdatingPersonal}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="birthDate">Dátum narodenia</Label>
                                        <Input
                                            id="birthDate"
                                            type="date"
                                            value={personalForm.birthDate ? format(personalForm.birthDate, "yyyy-MM-dd") : ""}
                                            onChange={(e) => {
                                                const date = e.target.value ? new Date(e.target.value) : undefined
                                                setPersonalForm((prev) => ({ ...prev, birthDate: date }))
                                            }}
                                            disabled={isUpdatingPersonal}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="gender">Pohlavie</Label>
                                        <Select
                                            value={personalForm.gender}
                                            onValueChange={(value) => setPersonalForm((prev) => ({ ...prev, gender: value }))}
                                            disabled={isUpdatingPersonal}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Vyberte pohlavie" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="muž">Muž</SelectItem>
                                                <SelectItem value="žena">Žena</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <Button type="submit" className="w-full" disabled={isUpdatingPersonal}>
                                    {isUpdatingPersonal ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Ukladám zmeny...
                                        </>
                                    ) : (
                                        "Uložiť zmeny"
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                )
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
                                        disabled={isChangingPassword}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => togglePasswordVisibility("oldPassword")}
                                        disabled={isChangingPassword}
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
                                        disabled={isChangingPassword}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => togglePasswordVisibility("newPassword")}
                                        disabled={isChangingPassword}
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
                                        disabled={isChangingPassword}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => togglePasswordVisibility("confirmPassword")}
                                        disabled={isChangingPassword}
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
                                    isChangingPassword ||
                                    passwordForm.newPassword !== passwordForm.confirmPassword ||
                                    !passwordForm.oldPassword ||
                                    !passwordForm.newPassword ||
                                    !passwordForm.confirmPassword
                                }
                            >
                                {isChangingPassword ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Mením heslo...
                                    </>
                                ) : (
                                    "Zmeniť heslo"
                                )}
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
                                            disabled={isAddingCamera}
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
                                            disabled={isAddingCamera}
                                        />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full" disabled={isAddingCamera}>
                                    {isAddingCamera ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Pridávam kameru...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Pridať kameru
                                        </>
                                    )}
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
                            {isLoadingCameras ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                                    <span>Načítavam kamery...</span>
                                </div>
                            ) : camerasError ? (
                                <div className="text-center py-8">
                                    <p className="text-red-600 mb-2">{camerasError}</p>
                                    <Button variant="outline" size="sm" onClick={fetchCameras}>
                                        Skúsiť znovu
                                    </Button>
                                </div>
                            ) : cameras.length === 0 ? (
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
                                                disabled={deletingCameraId === camera.id}
                                            >
                                                {deletingCameraId === camera.id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="h-4 w-4" />
                                                )}
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
                                        disabled={isAddingAccessory}
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
                                        disabled={isAddingAccessory}
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={isAddingAccessory}>
                                    {isAddingAccessory ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Pridávam zariadenie...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Pridať zariadenie
                                        </>
                                    )}
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
                                                disabled={deletingAccessoryId === accessory.id}
                                            >
                                                {deletingAccessoryId === accessory.id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="h-4 w-4" />
                                                )}
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
                                        disabled={isAddingAnalysis}
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
                                        disabled={isAddingAnalysis}
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={isAddingAnalysis}>
                                    {isAddingAnalysis ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Pridávam analýzu...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Pridať analýzu
                                        </>
                                    )}
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
                                                disabled={deletingAnalysisId === analysis.id}
                                            >
                                                {deletingAnalysisId === analysis.id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="h-4 w-4" />
                                                )}
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
                                        disabled={isAddingDiagnosis}
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={isAddingDiagnosis}>
                                    {isAddingDiagnosis ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Pridávam diagnózu...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Pridať diagnózu
                                        </>
                                    )}
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
                            {isLoadingDiagnoses ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                                    <span>Načítavam diagnózy...</span>
                                </div>
                            ) : diagnosesError ? (
                                <div className="text-center py-8">
                                    <p className="text-red-600 mb-2">{diagnosesError}</p>
                                    <Button variant="outline" size="sm" onClick={fetchDiagnoses}>
                                        Skúsiť znovu
                                    </Button>
                                </div>
                            ) : diagnoses.length === 0 ? (
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
                                                disabled={deletingDiagnosisId === diagnosis.id}
                                            >
                                                {deletingDiagnosisId === diagnosis.id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="h-4 w-4" />
                                                )}
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