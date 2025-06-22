"use client"

import { useState, useMemo } from "react"
import { Calendar, Camera, User, CheckCircle, Clock, Plus, Edit3, ThumbsUp, ThumbsDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { getOriginalPictures, type OriginalPicture } from "@/api/analysePhotoApi"
import { useEffect } from "react"
import { getDiagnoses, getCameras, getAdditionalDevices } from "@/api/settingsApi"
import { type AnalysisItem, getAnalyses } from "@/api/settingsApi"

interface AnalysisResult {
    id: string
    type: string
    condition: string
    confidence: number
    description: string
    recommendations: string[]
    createdAt: string
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

// Random analysis text generators
const generateRandomCondition = () => {
    const conditions = [
        "Normálne nálezy sietnice",
        "Mierny edém makuly",
        "Diabetická retinopatia - počiatočné štádium",
        "Glaukómové zmeny optického disku",
        "Hypertenzívna retinopatia",
        "Vekové zmeny makuly",
        "Cievne abnormality sietnice",
        "Retinálne krvácanie",
        "Druzy v makulárnej oblasti",
        "Neovaskularizácia sietnice",
        "Atrofia optického nervu",
        "Papilledém",
        "Centrálna seróza chorioretinopátia",
        "Epiretinálna membrána",
        "Vitreoretinálna trakcia",
    ]
    return conditions[Math.floor(Math.random() * conditions.length)]
}

const generateRandomDescription = () => {
    const anatomicalParts = [
        "optický disk",
        "makula",
        "cievny systém",
        "sietnica",
        "fovea",
        "peripapilárna oblasť",
        "temporálne kvadranty",
        "nazálne kvadranty",
        "periférna sietnica",
        "vitreoretinálne rozhranie",
    ]

    const findings = [
        "vykazuje normálnu morfológiu",
        "má správnu farbu a kontúry",
        "ukazuje patologické zmeny",
        "má zmenené pigmentácie",
        "vykazuje edematózne zmeny",
        "má abnormálne cievne vzory",
        "ukazuje známky zápalového procesu",
        "má degeneratívne zmeny",
        "vykazuje ischemické oblasti",
        "má mikroaneuryzmata",
        "ukazuje tvrdé exsudáty",
        "má mäkké exsudáty",
        "vykazuje hemorágie",
    ]

    const assessments = [
        "Celkový stav oka je v rámci fyziologických hodnôt.",
        "Pozorované zmeny si vyžadujú ďalšie sledovanie.",
        "Odporúča sa konzultácia so špecializovaným oftalmológom.",
        "Nálezy sú konzistentné s vekovo-primeranými zmenami.",
        "Detekované abnormality môžu indikovať systémové ochorenie.",
        "Progresívne zmeny si vyžadujú pravidelné kontroly.",
        "Akútne zmeny si vyžadujú okamžitú pozornosť.",
        "Chronické zmeny sú stabilné bez progresie.",
    ]

    const part1 = anatomicalParts[Math.floor(Math.random() * anatomicalParts.length)]
    const finding1 = findings[Math.floor(Math.random() * findings.length)]
    const part2 = anatomicalParts[Math.floor(Math.random() * anatomicalParts.length)]
    const finding2 = findings[Math.floor(Math.random() * findings.length)]
    const assessment = assessments[Math.floor(Math.random() * assessments.length)]

    return `Detailná analýza ukázala, že ${part1} ${finding1}. ${part2.charAt(0).toUpperCase() + part2.slice(1)} ${finding2}. ${assessment} Odporúča sa korelácia s klinickými príznakmi a anamnézou pacienta pre kompletnú diagnostiku.`
}

const generateRandomRecommendations = () => {
    const allRecommendations = [
        "Odporúča sa kontrola u oftalmológa do 3 mesiacov",
        "Pravidelné sledovanie progresie zmien",
        "Korelácia s celkovým zdravotným stavom pacienta",
        "Doplnenie OCT vyšetrenia pre detailnejšiu analýzu",
        "Fluorescenčná angiografia pre hodnotenie cievneho systému",
        "Kontrola vnútroočného tlaku",
        "Sledovanie systémového krvného tlaku",
        "Kontrola hladiny cukru v krvi",
        "Úprava životného štýlu a stravovania",
        "Pravidelné cvičenie a fyzická aktivita",
        "Ochrana očí pred UV žiarením",
        "Suplementácia vitamínov pre zdravie očí",
        "Konzultácia s internistom",
        "Genetické poradenstvo pri rodinnej anamnéze",
        "Psychologická podpora pri zhoršení zraku",
    ]

    const numRecommendations = Math.floor(Math.random() * 4) + 2 // 2-5 recommendations
    const selectedRecommendations = []
    const usedIndices = new Set()

    while (selectedRecommendations.length < numRecommendations) {
        const index = Math.floor(Math.random() * allRecommendations.length)
        if (!usedIndices.has(index)) {
            usedIndices.add(index)
            selectedRecommendations.push(allRecommendations[index])
        }
    }

    return selectedRecommendations
}

export default function PhotoGallery() {
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [userDescription, setUserDescription] = useState("")
    const [isEditingDescription, setIsEditingDescription] = useState(false)
    const [feedback, setFeedback] = useState<"like" | "dislike" | null>(null)
    const [selectedAnalysisType, setSelectedAnalysisType] = useState("type1")
    const [selectedAnalysisId, setSelectedAnalysisId] = useState<string | null>(null)
    const [diagnosisOptions, setDiagnosisOptions] = useState<{ id: string; name: string }[]>([])
    const [deviceOptions, setDeviceOptions] = useState<{ id: string; name: string }[]>([])
    const [additionalDeviceOptions, setAdditionalDeviceOptions] = useState<{ id: string; name: string }[]>([])

    const [photos, setPhotos] = useState<Photo[]>([])
    const [isLoadingPhotos, setIsLoadingPhotos] = useState(true)
    const [photosError, setPhotosError] = useState<string | null>(null)
    const [analysisTypes, setAnalysisTypes] = useState<AnalysisItem[]>([])

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
    }

    const handleAnalyze = async () => {
        if (!selectedPhoto) return

        setIsAnalyzing(true)

        // Simulate API call with random delay
        const delay = Math.floor(Math.random() * 3000) + 1500 // 1.5-4.5 seconds
        await new Promise((resolve) => setTimeout(resolve, delay))

        // Generate random analysis results
        const newAnalysis: AnalysisResult = {
            id: `analysis-${Date.now()}`,
            type: selectedAnalysisType,
            condition: generateRandomCondition(),
            confidence: Math.floor(Math.random() * 25) + 75, // 75-99% confidence
            description: generateRandomDescription(),
            recommendations: generateRandomRecommendations(),
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

    const getAnalysisTypeLabel = (id: string) => {
        return analysisTypes.find((type) => type.id.toString() === id)?.name || id
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

        // Sort by date within each group
        const sortByDate = (a: Photo, b: Photo) => {
            const dateA = new Date(a.capturedDate)
            const dateB = new Date(b.capturedDate)
            return filters.dateSort === "newest" ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime()
        }

        filtered.sort(sortByDate)
        unfiltered.sort(sortByDate)

        return { filtered, unfiltered }
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
                    analyses: [], // Start with empty analyses array
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

    const fetchAnalysisTypes = async () => {
        try {
            const types = await getAnalyses()
            setAnalysisTypes(types)
        } catch (error) {
            console.error("Chyba pri načítaní typov analýz:", error)
        }
    }

    useEffect(() => {
        fetchPhotos()
        fetchFilters()
        fetchAnalysisTypes()
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
                                        <SelectItem value="all">Všetky</SelectItem>
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
                                        <SelectItem value="all">Všetky</SelectItem>
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
                                        <SelectItem value="all">Všetky</SelectItem>
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
                <DialogContent className="!w-[85vw] !max-w-[1200px] h-[95vh] max-h-[95vh] p-0 overflow-hidden flex flex-col [&>button]:top-4 [&>button]:right-4 [&>button]:z-50">
                    <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0">
                        <DialogTitle className="text-xl">{selectedPhoto?.title}</DialogTitle>
                    </DialogHeader>

                    {selectedPhoto && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0 overflow-hidden px-6 pb-6">
                            {/* Photo Section - Full width on mobile, half on desktop */}
                            <div className="space-y-4 flex flex-col min-h-0">
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
                            <div className="space-y-4 overflow-y-auto h-full min-h-0">
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
                                                    <SelectItem key={type.id} value={type.id.toString()}>
                                                        {type.name}
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

                                {/* Selected Analysis Details */}
                                {selectedAnalysis && (
                                    <Card className="py-0">
                                        <CardContent className="p-4">
                                            <div className="space-y-4">
                                                <div>
                                                    <h3 className="font-semibold mb-2">Výsledky analýzy</h3>
                                                    <div className="text-sm text-muted-foreground mb-1">
                                                        {getAnalysisTypeLabel(selectedAnalysis.type)} •{" "}
                                                        {new Date(selectedAnalysis.createdAt).toLocaleString("sk-SK")}
                                                    </div>
                                                    <div className="text-sm font-medium">{selectedAnalysis.confidence}% spoľahlivosť</div>
                                                </div>

                                                <div>
                                                    <h4 className="font-medium text-sm mb-2">Stav</h4>
                                                    <p className="text-sm bg-muted p-3 rounded">{selectedAnalysis.condition}</p>
                                                </div>

                                                <div>
                                                    <h4 className="font-medium text-sm mb-2">Popis</h4>
                                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                                        {selectedAnalysis.description}
                                                    </p>
                                                </div>

                                                <div>
                                                    <h4 className="font-medium text-sm mb-2">Odporúčania</h4>
                                                    <ul className="text-sm text-muted-foreground space-y-1">
                                                        {selectedAnalysis.recommendations.map((rec, index) => (
                                                            <li key={index} className="flex items-start gap-2">
                                                                <span className="text-primary mt-1">•</span>
                                                                {rec}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <Separator />

                                                {/* Feedback Section */}
                                                <div>
                                                    <h4 className="font-medium text-sm mb-3">Ohodnotiť túto analýzu</h4>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant={feedback === "like" ? "default" : "outline"}
                                                            size="sm"
                                                            onClick={() => handleFeedback("like")}
                                                        >
                                                            <ThumbsUp className="h-4 w-4 mr-1" />
                                                            Užitočné
                                                        </Button>
                                                        <Button
                                                            variant={feedback === "dislike" ? "destructive" : "outline"}
                                                            size="sm"
                                                            onClick={() => handleFeedback("dislike")}
                                                        >
                                                            <ThumbsDown className="h-4 w-4 mr-1" />
                                                            Neužitočné
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* No analyses message */}
                                {selectedPhoto.analyses.length === 0 && (
                                    <Card className="py-0">
                                        <CardContent className="p-6 text-center">
                                            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                            <p className="text-muted-foreground mb-2">Žiadne analýzy zatiaľ neboli vykonané</p>
                                            <p className="text-sm text-muted-foreground">
                                                Vyberte typ analýzy vyššie a spustite novú analýzu tohto obrázka
                                            </p>
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
