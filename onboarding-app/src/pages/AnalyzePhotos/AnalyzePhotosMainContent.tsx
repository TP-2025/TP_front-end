"use client"

import { useState, useMemo } from "react"
import { Edit3, Calendar, Camera, User, CheckCircle, Clock, Plus, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { getOriginalPictures, type OriginalPicture } from "@/api/analysePhotoApi"
import { useEffect } from "react"
import { getDiagnoses, getCameras, getAdditionalDevices } from "@/api/settingsApi"

interface AnalysisResult {
    id: string
    type: string
    condition: string
    confidence: number
    description: string
    recommendations: string[]
    createdAt: string
    doctorNotes?: string
}

interface Photo {
    id: string
    src: string
    title: string
    capturedDate: string
    camera: string
    patient: string
    diagnosis?: string
    device?: string
    additionalDevice?: string
    analyses: AnalysisResult[]
    description?: string
}

// Analysis types
const analysisTypes = [
    { value: "type1", label: "Typ 1 - Základná analýza", description: "Základné vyhodnotenie stavu sietnice" },
    { value: "type2", label: "Typ 2 - Pokročilá analýza", description: "Detailná analýza s AI diagnostikou" },
    {
        value: "type3",
        label: "Typ 3 - Špecializovaná analýza",
        description: "Špecializovaná analýza pre konkrétne ochorenia",
    },
]

export default function PhotoGallery() {
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [userDescription, setUserDescription] = useState("")
    const [isEditingDescription, setIsEditingDescription] = useState(false)
    const [feedback, setFeedback] = useState<"like" | "dislike" | null>(null)
    const [selectedAnalysisType, setSelectedAnalysisType] = useState("type1")
    const [selectedAnalysisId, setSelectedAnalysisId] = useState<string | null>(null)
    const [editingDoctorNotes, setEditingDoctorNotes] = useState<string | null>(null)
    const [doctorNotesText, setDoctorNotesText] = useState("")
    const [diagnosisOptions, setDiagnosisOptions] = useState<{ id: string; name: string }[]>([])
    const [deviceOptions, setDeviceOptions] = useState<{ id: string; name: string }[]>([])
    const [additionalDeviceOptions, setAdditionalDeviceOptions] = useState<{ id: string; name: string }[]>([])

    const [photos, setPhotos] = useState<Photo[]>([])
    const [isLoadingPhotos, setIsLoadingPhotos] = useState(true)
    const [photosError, setPhotosError] = useState<string | null>(null)

    const [filters, setFilters] = useState({
        analyzed: "all",
        eye: "all",
        patientName: "",
        diagnosis: "all",
        device: "all",
        additionalDevice: "all",
        dateSort: "newest",
    })

    const handlePhotoClick = (photo: Photo) => {
        setSelectedPhoto(photo)
        setUserDescription(photo.description || "")
        setIsEditingDescription(false)
        setFeedback(null)
        setSelectedAnalysisId(photo.analyses.length > 0 ? photo.analyses[0].id : null)
        setEditingDoctorNotes(null)
    }

    const handleAnalyze = async () => {
        if (!selectedPhoto) return

        setIsAnalyzing(true)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Mock analysis results based on type
        const mockAnalysisResults = {
            type1: {
                condition: "Základná analýza dokončená",
                description: "Základné vyhodnotenie stavu sietnice",
                recommendations: [
                    "Odporúča sa profesionálne posúdenie",
                    "Porovnať s predchádzajúcimi vyšetreniami",
                    "Sledovať príznaky pacienta",
                ],
            },
            type2: {
                condition: "Pokročilá analýza dokončená",
                description:
                    "Pokročilá AI analýza identifikovala detailné charakteristiky sietnice. Použité boli algoritmy hlbokého učenia na detekciu jemných zmien v cievnom systéme a morfológii sietnice. Výsledky ukazujú komplexný obraz zdravotného stavu oka.",
                recommendations: [
                    "Detailné vyhodnotenie špecialistom",
                    "Korelácia s klinickými príznakmi",
                    "Sledovanie progresie v čase",
                ],
            },
            type3: {
                condition: "Špecializovaná analýza dokončená",
                description:
                    "Špecializovaná analýza zameraná na konkrétne patológie bola vykonaná. Použité boli špecifické algoritmy na detekciu diabetickej retinopatia, glaukómu a makulárnych ochorení. Analýza poskytuje cielené hodnotenie rizikových faktorov.",
                recommendations: [
                    "Konzultácia s retinológom",
                    "Špecifické diagnostické testy",
                    "Individualizovaný liečebný plán",
                ],
            },
        }

        const selectedResult = mockAnalysisResults[selectedAnalysisType as keyof typeof mockAnalysisResults]

        const newAnalysis: AnalysisResult = {
            id: `analysis-${Date.now()}`,
            type: selectedAnalysisType,
            condition: selectedResult.condition,
            confidence: Math.floor(Math.random() * 20) + 80,
            description: selectedResult.description,
            recommendations: selectedResult.recommendations,
            createdAt: new Date().toISOString(),
        }

        setSelectedPhoto((prev) => {
            if (!prev) return null
            const updatedPhoto = { ...prev, analyses: [...prev.analyses, newAnalysis] }
            setSelectedAnalysisId(newAnalysis.id)
            return updatedPhoto
        })
        setIsAnalyzing(false)
    }

    const handleFeedback = (type: "like" | "dislike") => {
        setFeedback(type)
        // Here you would send feedback to your backend
        console.log(`Spätná väzba: ${type} pre analýzu ${selectedAnalysisId}`)
    }

    const handleSaveDescription = () => {
        // Here you would save the user description to your backend
        console.log(`Ukladanie popisu: ${userDescription} pre fotografiu ${selectedPhoto?.id}`)
        setIsEditingDescription(false)
        setSelectedPhoto((prev) => (prev ? { ...prev, description: userDescription } : null))
    }

    const handleSaveDoctorNotes = (analysisId: string) => {
        setSelectedPhoto((prev) => {
            if (!prev) return null
            const updatedAnalyses = prev.analyses.map((analysis) =>
                analysis.id === analysisId ? { ...analysis, doctorNotes: doctorNotesText } : analysis,
            )
            return { ...prev, analyses: updatedAnalyses }
        })
        setEditingDoctorNotes(null)
        setDoctorNotesText("")
    }

    const getAnalysisTypeLabel = (type: string) => {
        return analysisTypes.find((t) => t.value === type)?.label || type
    }

    const selectedAnalysis = selectedPhoto?.analyses.find((a) => a.id === selectedAnalysisId)

    const filteredAndSortedPhotos = useMemo(() => {
        const filtered = photos.filter((photo) => {
            // Filter by analysis status
            if (filters.analyzed === "analyzed" && photo.analyses.length === 0) return false
            if (filters.analyzed === "not-analyzed" && photo.analyses.length > 0) return false

            // Filter by eye
            if (filters.eye === "left" && !photo.title.toLowerCase().includes("ľavé")) return false
            if (filters.eye === "right" && !photo.title.toLowerCase().includes("pravé")) return false

            // Filter by patient name
            if (filters.patientName && !photo.patient.toLowerCase().includes(filters.patientName.toLowerCase())) return false

            // Filter by diagnosis
            if (filters.diagnosis !== "all" && (photo.diagnosis || "") !== filters.diagnosis) return false

            // Filter by device
            if (filters.device !== "all" && (photo.device || "") !== filters.device) return false

            // Filter by additional device
            if (filters.additionalDevice !== "all" && (photo.additionalDevice || "") !== filters.additionalDevice)
                return false

            return true
        })

        // Separate filtered and unfiltered photos
        const unfiltered = photos.filter((photo) => !filtered.includes(photo))
        const allPhotos = [...filtered, ...unfiltered]

        // Sort by date within each group
        const sortByDate = (a: Photo, b: Photo) => {
            const dateA = new Date(a.capturedDate)
            const dateB = new Date(b.capturedDate)
            return filters.dateSort === "newest" ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime()
        }

        filtered.sort(sortByDate)
        unfiltered.sort(sortByDate)

        return { filtered, unfiltered, all: allPhotos }
    }, [filters, photos])

    const fetchPhotos = async () => {
        setIsLoadingPhotos(true)
        setPhotosError(null)

        try {
            const raw: OriginalPicture[] = await getOriginalPictures()
            console.log("📷 Raw photos data:", raw)

            const mapped: Photo[] = raw.map((item) => {
                const apiBaseUrl = "http://davidovito.duckdns.org:8080"
                // Ensure proper URL formatting
                let imageUrl = item.path
                if (!imageUrl.startsWith("http")) {
                    imageUrl = imageUrl.startsWith("/") ? apiBaseUrl + imageUrl : apiBaseUrl + "/" + imageUrl
                }

                console.log("📷 Using image URL:", imageUrl)

                const isLeftEye = item.eye?.toUpperCase() === "L"
                const titleEye = isLeftEye ? "Ľavé" : item.eye?.toUpperCase() === "R" ? "Pravé" : "Neznáme"

                return {
                    id: item.id.toString(),
                    src: imageUrl,
                    title: `${titleEye} oko - Pacient #${item.patient_id}`,
                    capturedDate: item.date || "Neznámy dátum",
                    camera: "Neznáma kamera",
                    patient: `Pacient #${item.patient_id}`,
                    diagnosis: item.diagnosis_notes || undefined,
                    device: item.device_id?.toString() || undefined,
                    additionalDevice: item.additional_device_id?.toString() || undefined,
                    analyses: [],
                    description: item.technic_notes || undefined,
                }
            })

            console.log("📷 Mapped photos:", mapped)
            setPhotos(mapped)
        } catch (err) {
            console.error("Nepodarilo sa načítať fotky:", err)
            setPhotosError("Nepodarilo sa načítať fotky.")
        } finally {
            setIsLoadingPhotos(false)
        }
    }

    const fetchFilters = async () => {
        try {
            const [diagnoses, devices, additionalDevices] = await Promise.all([
                getDiagnoses(),
                getCameras(),
                getAdditionalDevices(),
            ])
            setDiagnosisOptions(diagnoses.map((d) => ({ id: d.id.toString(), name: d.name })))
            setDeviceOptions(devices.map((d) => ({ id: d.id.toString(), name: d.name })))
            setAdditionalDeviceOptions(additionalDevices.map((d) => ({ id: d.id.toString(), name: d.name })))
        } catch (error) {
            console.error("Chyba pri načítaní filtrov:", error)
        }
    }

    useEffect(() => {
        fetchPhotos()
        fetchFilters()
    }, [])

    return (
        <div className="w-full">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Galéria analýzy očí</h1>
                <p className="text-muted-foreground">
                    Kliknite na ľubovoľnú fotografiu pre zobrazenie detailnej analýzy a informácií
                </p>
            </div>

            {/* Filter Controls */}
            <Card className="mb-6 py-0">
                <CardContent className="p-0">
                    <div className="px-4 py-4">
                        <h3 className="font-semibold mb-4">Filtre</h3>
                        <div className="flex flex-wrap gap-4 items-end">
                            {/* Analysis Status Filter */}
                            <div className="space-y-2 min-w-[160px]">
                                <Label htmlFor="analyzed-filter">Stav analýzy</Label>
                                <Select
                                    value={filters.analyzed}
                                    onValueChange={(value) => setFilters((prev) => ({ ...prev, analyzed: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Všetky</SelectItem>
                                        <SelectItem value="analyzed">Analyzované</SelectItem>
                                        <SelectItem value="not-analyzed">Neanalyzované</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Eye Filter */}
                            <div className="space-y-2 min-w-[140px]">
                                <Label htmlFor="eye-filter">Oko</Label>
                                <Select value={filters.eye} onValueChange={(value) => setFilters((prev) => ({ ...prev, eye: value }))}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Všetky</SelectItem>
                                        <SelectItem value="left">Ľavé oko</SelectItem>
                                        <SelectItem value="right">Pravé oko</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Diagnosis Filter */}
                            <div className="space-y-2 min-w-[180px]">
                                <Label htmlFor="diagnosis-filter">Diagnóza</Label>
                                <Select
                                    value={filters.diagnosis}
                                    onValueChange={(value) => setFilters((prev) => ({ ...prev, diagnosis: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {diagnosisOptions.map((option) => (
                                            <SelectItem key={option.id} value={option.name}>
                                                {option.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Device Filter */}
                            <div className="space-y-2 min-w-[180px]">
                                <Label htmlFor="device-filter">Zariadenie</Label>
                                <Select
                                    value={filters.device}
                                    onValueChange={(value) => setFilters((prev) => ({ ...prev, device: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {deviceOptions.map((device) => (
                                            <SelectItem key={device.id} value={device.name}>
                                                {device.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Additional Device Filter */}
                            <div className="space-y-2 min-w-[180px]">
                                <Label htmlFor="additional-device-filter">Pridavné zariadenie</Label>
                                <Select
                                    value={filters.additionalDevice}
                                    onValueChange={(value) => setFilters((prev) => ({ ...prev, additionalDevice: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {additionalDeviceOptions.map((device) => (
                                            <SelectItem key={device.id} value={device.name}>
                                                {device.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Patient Name Filter */}
                            <div className="space-y-2 min-w-[200px] flex-1 max-w-[300px]">
                                <Label htmlFor="patient-filter">Meno pacienta</Label>
                                <Input
                                    id="patient-filter"
                                    placeholder="Hľadať pacienta..."
                                    value={filters.patientName}
                                    onChange={(e) => setFilters((prev) => ({ ...prev, patientName: e.target.value }))}
                                />
                            </div>

                            {/* Date Sort */}
                            <div className="space-y-2 min-w-[160px]">
                                <Label htmlFor="date-sort">Zoradiť podľa dátumu</Label>
                                <Select
                                    value={filters.dateSort}
                                    onValueChange={(value) => setFilters((prev) => ({ ...prev, dateSort: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="newest">Najnovšie</SelectItem>
                                        <SelectItem value="oldest">Najstaršie</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Clear Filters Button */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    setFilters({
                                        analyzed: "all",
                                        eye: "all",
                                        patientName: "",
                                        diagnosis: "all",
                                        device: "all",
                                        additionalDevice: "all",
                                        dateSort: "newest",
                                    })
                                }
                                className="mb-2"
                            >
                                Vymazať filtre
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    if (photos.length > 0) {
                                        const testUrl = photos[0].src
                                        console.log("🧪 Testing image URL:", testUrl)
                                        const testImg = new Image()
                                        testImg.onload = () => console.log("✅ Test image loaded successfully")
                                        testImg.onerror = (e) => console.error("❌ Test image failed:", e)
                                        testImg.src = testUrl
                                    }
                                }}
                                className="mb-2"
                            >
                                Test Image Loading
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {isLoadingPhotos ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
                </div>
            ) : photosError ? (
                <div className="text-red-500 text-center py-6">{photosError}</div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-2">
                    {/* Filtered (prioritized) photos */}
                    {filteredAndSortedPhotos.filtered.map((photo) => (
                        <Card
                            key={photo.id}
                            className="cursor-pointer hover:shadow-lg transition-all duration-200 overflow-hidden opacity-100 py-0"
                            onClick={() => handlePhotoClick(photo)}
                        >
                            <CardContent className="p-0">
                                <div className="relative overflow-hidden">
                                    <img
                                        src={photo.src || "/placeholder.svg?height=96&width=150"}
                                        alt={photo.title}
                                        className="w-full h-24 object-cover rounded-t-lg"
                                        onLoad={() => {
                                            console.log("✅ Image loaded successfully:", photo.src)
                                        }}
                                        onError={(e) => {
                                            console.error("❌ Image failed to load:", photo.src)
                                            // Set a placeholder image on error
                                            e.currentTarget.src = "/placeholder.svg?height=96&width=150"
                                        }}
                                    />
                                    <div className="absolute top-1 right-1">
                                        {photo.analyses.length > 0 ? (
                                            <div className="bg-green-500 text-white rounded-full p-1 flex items-center gap-1">
                                                <CheckCircle className="h-3 w-3" />
                                                <span className="text-xs font-medium">{photo.analyses.length}</span>
                                            </div>
                                        ) : (
                                            <div className="bg-orange-500 text-white rounded-full p-1">
                                                <Clock className="h-3 w-3" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute inset-0 [&>*]:!hidden"></div>
                                </div>
                                <div className="p-2">
                                    <h3 className="font-semibold text-xs mb-1 truncate">{photo.title}</h3>
                                    <p className="text-xs text-muted-foreground truncate">{photo.patient}</p>
                                    <p className="text-xs text-muted-foreground">{photo.capturedDate}</p>
                                    {photo.analyses.length > 0 && (
                                        <div className="flex items-center gap-1 mt-1">
                                            <CheckCircle className="h-3 w-3 text-green-500" />
                                            <span className="text-xs text-green-600">
                        {photo.analyses.length} {photo.analyses.length === 1 ? "analýza" : "analýz"}
                      </span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {/* Unfiltered (background) photos */}
                    {filteredAndSortedPhotos.unfiltered.map((photo) => (
                        <Card
                            key={photo.id}
                            className="cursor-pointer hover:shadow-lg transition-all duration-200 overflow-hidden opacity-30 grayscale py-0"
                            onClick={() => handlePhotoClick(photo)}
                        >
                            <CardContent className="p-0">
                                <div className="relative overflow-hidden">
                                    <img
                                        src={photo.src || "/placeholder.svg?height=96&width=150"}
                                        alt={photo.title}
                                        className="w-full h-24 object-cover rounded-t-lg"
                                        onLoad={() => {
                                            console.log("✅ Image loaded successfully:", photo.src)
                                        }}
                                        onError={(e) => {
                                            console.error("❌ Image failed to load:", photo.src)
                                            e.currentTarget.src = "/placeholder.svg?height=96&width=150"
                                        }}
                                    />
                                    <div className="absolute top-1 right-1">
                                        {photo.analyses.length > 0 ? (
                                            <div className="bg-green-500 text-white rounded-full p-1 flex items-center gap-1">
                                                <CheckCircle className="h-3 w-3" />
                                                <span className="text-xs font-medium">{photo.analyses.length}</span>
                                            </div>
                                        ) : (
                                            <div className="bg-orange-500 text-white rounded-full p-1">
                                                <Clock className="h-3 w-3" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute inset-0 [&>*]:!hidden"></div>
                                </div>
                                <div className="p-2">
                                    <h3 className="font-semibold text-xs mb-1 truncate">{photo.title}</h3>
                                    <p className="text-xs text-muted-foreground truncate">{photo.patient}</p>
                                    <p className="text-xs text-muted-foreground">{photo.capturedDate}</p>
                                    {photo.analyses.length > 0 && (
                                        <div className="flex items-center gap-1 mt-1">
                                            <CheckCircle className="h-3 w-3 text-green-500" />
                                            <span className="text-xs text-green-600">
                        {photo.analyses.length} {photo.analyses.length === 1 ? "analýza" : "analýz"}
                      </span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Dialog content */}
            <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
                <DialogContent
                    className="w-[85vw] max-w-[1000px] h-[90vh] max-h-[900px] p-6 !w-[85vw] !max-w-[1000px]"
                    style={{
                        width: "85vw",
                        maxWidth: "1000px",
                        height: "90vh",
                        maxHeight: "900px",
                    }}
                >
                    <DialogHeader className="pb-4">
                        <DialogTitle className="text-xl">{selectedPhoto?.title}</DialogTitle>
                    </DialogHeader>

                    {selectedPhoto && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(90vh-8rem)] w-full">
                            {/* Photo Section - Full width on mobile, half on desktop */}
                            <div className="space-y-4 flex flex-col">
                                <div className="flex-1 min-h-0">
                                    <img
                                        src={selectedPhoto.src || "/placeholder.svg?height=400&width=600"}
                                        alt={selectedPhoto.title}
                                        className="w-full h-full object-contain rounded-lg border bg-white"
                                        onLoad={() => {
                                            console.log("✅ Modal image loaded successfully:", selectedPhoto.src)
                                        }}
                                        onError={(e) => {
                                            console.error("❌ Modal image failed to load:", selectedPhoto.src)
                                            e.currentTarget.src = "/placeholder.svg?height=400&width=600"
                                        }}
                                    />
                                </div>

                                {/* Photo Info - Compact */}
                                <Card className="py-0 flex-shrink-0">
                                    <CardContent className="p-4">
                                        <h3 className="font-semibold mb-3">Informácie o fotografii</h3>
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-muted-foreground" />
                                                <span>Pacient: {selectedPhoto.patient}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <span>Dátum: {selectedPhoto.capturedDate}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Camera className="h-4 w-4 text-muted-foreground" />
                                                <span>Fotoaparát: {selectedPhoto.camera}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">Diagnóza:</span>
                                                <span>{selectedPhoto.diagnosis || "Neurčená"}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* User Description Section - Compact */}
                                <Card className="py-0 flex-shrink-0">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="font-semibold">Vaše poznámky</h3>
                                            <Button variant="ghost" size="sm" onClick={() => setIsEditingDescription(!isEditingDescription)}>
                                                <Edit3 className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        {isEditingDescription ? (
                                            <div className="space-y-3">
                                                <Textarea
                                                    placeholder="Pridajte vlastný popis alebo poznámky k tomuto obrázku..."
                                                    value={userDescription}
                                                    onChange={(e) => setUserDescription(e.target.value)}
                                                    rows={3}
                                                />
                                                <div className="flex gap-2">
                                                    <Button size="sm" onClick={handleSaveDescription}>
                                                        Uložiť
                                                    </Button>
                                                    <Button size="sm" variant="outline" onClick={() => setIsEditingDescription(false)}>
                                                        Zrušiť
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-sm text-muted-foreground">
                                                {userDescription ? (
                                                    <div className="whitespace-pre-wrap break-words">{userDescription}</div>
                                                ) : (
                                                    "Kliknite na tlačidlo úprav pre pridanie poznámok..."
                                                )}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Analysis Section - Full height scrollable */}
                            <div className="space-y-4 overflow-y-auto h-full">
                                {/* Analysis Type Selection */}
                                <Card className="py-0">
                                    <CardContent className="p-4">
                                        <h3 className="font-semibold mb-3">Nová analýza</h3>
                                        <Select value={selectedAnalysisType} onValueChange={setSelectedAnalysisType}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Vyberte typ analýzy" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {analysisTypes.map((type) => (
                                                    <SelectItem key={type.value} value={type.value}>
                                                        <div>
                                                            <div className="font-medium">{type.label}</div>
                                                            <div className="text-xs text-muted-foreground">{type.description}</div>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Button onClick={handleAnalyze} className="w-full mt-3" disabled={isAnalyzing}>
                                            <Plus className="h-4 w-4 mr-2" />
                                            {isAnalyzing ? "Analyzujem..." : "Spustiť novú analýzu"}
                                        </Button>
                                    </CardContent>
                                </Card>

                                {isAnalyzing && (
                                    <Card className="py-0">
                                        <CardContent className="p-6 text-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                                            <p className="text-muted-foreground">Analyzujem obrázok...</p>
                                            <p className="text-xs text-muted-foreground mt-2">{getAnalysisTypeLabel(selectedAnalysisType)}</p>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* List of Analyses */}
                                {selectedPhoto.analyses.length > 0 && (
                                    <Card className="py-0">
                                        <CardContent className="p-4">
                                            <h3 className="font-semibold mb-3">Zoznam analýz ({selectedPhoto.analyses.length})</h3>
                                            <div className="space-y-2">
                                                {selectedPhoto.analyses.map((analysis, index) => (
                                                    <div
                                                        key={analysis.id}
                                                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                                                            selectedAnalysisId === analysis.id
                                                                ? "bg-primary/10 border-primary"
                                                                : "bg-muted/50 hover:bg-muted"
                                                        }`}
                                                        onClick={() => setSelectedAnalysisId(analysis.id)}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <Badge variant="outline" className="text-xs">
                                                                    #{index + 1}
                                                                </Badge>
                                                                <span className="text-sm font-medium">{getAnalysisTypeLabel(analysis.type)}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                {analysis.doctorNotes && <FileText className="h-3 w-3 text-blue-500" />}
                                                                <span className="text-xs text-muted-foreground">
                                  {new Date(analysis.createdAt).toLocaleDateString("sk-SK")}
                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="text-xs text-muted-foreground mt-1">
                                                            {analysis.condition} • {analysis.confidence}% spoľahlivosť
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
