"use client"

import { useState, useMemo } from "react"
import { ThumbsUp, ThumbsDown, Edit3, Calendar, Camera, User, CheckCircle, Clock, Plus, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

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

// Mock data - replace with your backend data
const mockPhotos: Photo[] = [
    {
        id: "1",
        src: "/placeholder.svg?height=300&width=300",
        title: "Ľavé oko - Pacient A",
        capturedDate: "2024-01-15",
        camera: "Canon EOS R5",
        patient: "Ján Novák",
        diagnosis: "Zdravá sietnica",
        device: "Fundus kamera Canon",
        additionalDevice: "Angiograf Heidelberg",
        analyses: [
            {
                id: "analysis-1",
                type: "type1",
                condition: "Zdravá sietnica",
                confidence: 94,
                description:
                    "Vyšetrenie sietnice ukazuje normálne cievne vzory bez známok diabetickej retinopatia, makulárnej degenerácie alebo iných patologických zmien. Optický disk vyzerá zdravo s jasnými okrajmi a vhodným pomerom jamky k disku.",
                recommendations: [
                    "Pokračovať v pravidelných očných vyšetreniach",
                    "Udržiavať zdravý životný štýl",
                    "Sledovať akékoľvek zmeny v zraku",
                ],
                createdAt: "2024-01-15T10:30:00Z",
                doctorNotes: "Pacient má výborný stav sietnice. Odporúčam kontrolu za 12 mesiacov.",
            },
            {
                id: "analysis-2",
                type: "type2",
                condition: "Zdravá sietnica - pokročilá analýza",
                confidence: 96,
                description: "Pokročilá AI analýza potvrdila zdravý stav sietnice s vysokou presnosťou.",
                recommendations: ["Pravidelné kontroly", "Zdravý životný štýl"],
                createdAt: "2024-01-16T14:20:00Z",
            },
        ],
        description: "Pacient bez zjavných problémov.",
    },
    {
        id: "2",
        src: "/placeholder.svg?height=300&width=300",
        title: "Pravé oko - Pacient B",
        capturedDate: "2024-01-16",
        camera: "Nikon D850",
        patient: "Jana Svobodová",
        diagnosis: "Diabetická retinopatia",
        device: "OCT Zeiss",
        additionalDevice: "Laser Topcon",
        analyses: [
            {
                id: "analysis-3",
                type: "type2",
                condition: "Mierná diabetická retinopatia",
                confidence: 87,
                description:
                    "Viditeľné sú včasné príznaky diabetickej retinopatia s mikroaneuryzmami a malými krvácaninami. Stav sa zdá byť v miernom neproliferatívnom štádiu bez známok makulárneho edému.",
                recommendations: [
                    "Zvýšiť frekvenciu monitorovania",
                    "Optimalizovať kontrolu cukru v krvi",
                    "Zvážiť odoslanie k špecialistovi na sietnicové ochorenia",
                ],
                createdAt: "2024-01-16T09:15:00Z",
                doctorNotes: "Potrebné sledovanie progresie. Kontrola za 3 mesiace.",
            },
        ],
    },
    {
        id: "3",
        src: "/placeholder.svg?height=300&width=300",
        title: "Ľavé oko - Pacient C",
        capturedDate: "2024-01-17",
        camera: "Sony A7R IV",
        patient: "Michal Novotný",
        diagnosis: "Glaukóm",
        device: "Fundus kamera Sony",
        additionalDevice: "Perimeter Octopus",
        analyses: [],
    },
    {
        id: "4",
        src: "/placeholder.svg?height=300&width=300",
        title: "Pravé oko - Pacient D",
        capturedDate: "2024-01-18",
        camera: "Canon EOS R6",
        patient: "Zuzana Krásna",
        diagnosis: "Makulárna degenerácia",
        device: "OCT Heidelberg",
        additionalDevice: "Angiograf Zeiss",
        analyses: [],
    },
    {
        id: "5",
        src: "/placeholder.svg?height=300&width=300",
        title: "Ľavé oko - Pacient E",
        capturedDate: "2024-01-19",
        camera: "Nikon Z9",
        patient: "Peter Veselý",
        diagnosis: "Zdravá sietnica",
        device: "Fundus kamera Nikon",
        additionalDevice: "Biometer IOLMaster",
        analyses: [],
    },
    {
        id: "6",
        src: "/placeholder.svg?height=300&width=300",
        title: "Pravé oko - Pacient F",
        capturedDate: "2024-01-20",
        camera: "Sony A1",
        patient: "Mária Kvetná",
        diagnosis: "Katarakta",
        device: "OCT Topcon",
        additionalDevice: "Pachymeter Pentacam",
        analyses: [],
    },
]

// Get unique diagnosis and device options from mock data
const diagnosisOptions = Array.from(new Set(mockPhotos.map((photo) => photo.diagnosis).filter(Boolean))) as string[]
const deviceOptions = Array.from(new Set(mockPhotos.map((photo) => photo.device).filter(Boolean))) as string[]
const additionalDeviceOptions = Array.from(
    new Set(mockPhotos.map((photo) => photo.additionalDevice).filter(Boolean)),
) as string[]

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

    const [filters, setFilters] = useState({
        analyzed: "all", // "all", "analyzed", "not-analyzed"
        eye: "all", // "all", "left", "right"
        patientName: "",
        diagnosis: "all",
        device: "all",
        additionalDevice: "all",
        dateSort: "newest", // "newest", "oldest"
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
                description:
                    "Základná automatizovaná analýza bola dokončená. Obrázok ukazuje štruktúry sietnice s rôznymi vlastnosťami, ktoré vyžadujú profesionálnu interpretáciu. Táto analýza je len na referenčné účely a mala by byť preskúmaná kvalifikovaným oftalmológom.",
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
        const filtered = mockPhotos.filter((photo) => {
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
        const unfiltered = mockPhotos.filter((photo) => !filtered.includes(photo))
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
    }, [filters])

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
                                        {diagnosisOptions.map((diagnosis) => (
                                            <SelectItem key={diagnosis} value={diagnosis}>
                                                {diagnosis}
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
                                            <SelectItem key={device} value={device}>
                                                {device}
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
                                            <SelectItem key={device} value={device}>
                                                {device}
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
                                    src={photo.src || "/placeholder.svg"}
                                    alt={photo.title}
                                    className="w-full h-24 object-cover rounded-t-lg"
                                />
                                {/* Analysis status indicator */}
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
                                    src={photo.src || "/placeholder.svg"}
                                    alt={photo.title}
                                    className="w-full h-24 object-cover rounded-t-lg"
                                />
                                {/* Analysis status indicator */}
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

            {/* Dialog content */}
            <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
                <DialogContent className="w-[95vw] max-w-none h-[90vh] overflow-y-auto overflow-x-hidden rounded-lg p-6">
                    <DialogHeader>
                        <DialogTitle>{selectedPhoto?.title}</DialogTitle>
                    </DialogHeader>

                    {selectedPhoto && (
                        <div className="grid lg:grid-cols-2 gap-6 mt-4">
                            {/* Photo Section */}
                            <div className="space-y-4">
                                <div className="w-full">
                                    <img
                                        src={selectedPhoto.src || "/placeholder.svg"}
                                        alt={selectedPhoto.title}
                                        className="w-full h-[450px] lg:h-[550px] object-cover rounded-lg border"
                                    />
                                </div>

                                {/* Photo Info */}
                                <Card className="py-0">
                                    <CardContent className="p-0">
                                        <div className="p-4 space-y-3">
                                            <h3 className="font-semibold">Informácie o fotografii</h3>
                                            <div className="space-y-2 text-sm">
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
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">Zariadenie:</span>
                                                    <span>{selectedPhoto.device || "Neurčené"}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">Pridavné zariadenie:</span>
                                                    <span>{selectedPhoto.additionalDevice || "Neurčené"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* User Description Section */}
                                <Card className="py-0">
                                    <CardContent className="p-0">
                                        <div className="px-4 py-4 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-semibold">Vaše poznámky</h3>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setIsEditingDescription(!isEditingDescription)}
                                                >
                                                    <Edit3 className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            {isEditingDescription ? (
                                                <div className="space-y-3">
                                                    <Textarea
                                                        placeholder="Pridajte vlastný popis alebo poznámky k tomuto obrázku..."
                                                        value={userDescription}
                                                        onChange={(e) => setUserDescription(e.target.value)}
                                                        rows={4}
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
                                                        <div className="whitespace-pre-wrap break-words overflow-wrap-anywhere">
                                                            {userDescription}
                                                        </div>
                                                    ) : (
                                                        "Kliknite na tlačidlo úprav pre pridanie poznámok..."
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Analysis Section */}
                            <div className="space-y-4">
                                {/* Analysis Type Selection */}
                                <Card className="py-0">
                                    <CardContent className="p-0">
                                        <div className="px-4 py-4 space-y-2">
                                            <h3 className="font-semibold">Nová analýza</h3>
                                            <Select value={selectedAnalysisType} onValueChange={setSelectedAnalysisType}>
                                                <SelectTrigger className="w-full text-center">
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
                                            <Button onClick={handleAnalyze} className="w-full" disabled={isAnalyzing}>
                                                <Plus className="h-4 w-4 mr-2" />
                                                {isAnalyzing ? "Analyzujem..." : "Spustiť novú analýzu"}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                {isAnalyzing && (
                                    <Card className="py-0">
                                        <CardContent className="p-0">
                                            <div className="p-6 text-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                                                <p className="text-muted-foreground">Analyzujem obrázok...</p>
                                                <p className="text-xs text-muted-foreground mt-2">
                                                    {getAnalysisTypeLabel(selectedAnalysisType)}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* List of Analyses */}
                                {selectedPhoto.analyses.length > 0 && (
                                    <Card className="py-0">
                                        <CardContent className="p-0">
                                            <div className="px-4 py-4 space-y-3">
                                                <h3 className="font-semibold">Zoznam analýz ({selectedPhoto.analyses.length})</h3>
                                                <div className="space-y-2 max-h-40 overflow-y-auto">
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
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Selected Analysis Details */}
                                {selectedAnalysis && (
                                    <Card className="py-0">
                                        <CardContent className="p-0">
                                            <div className="px-4 py-4 space-y-3">
                                                <div className="space-y-2">
                                                    <h3 className="font-semibold">Výsledky analýzy</h3>
                                                    <div className="text-sm text-muted-foreground">
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

                                {/* Doctor's Notes for Selected Analysis */}
                                {selectedAnalysis && (
                                    <Card className="py-0">
                                        <CardContent className="p-0">
                                            <div className="px-4 py-4 space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-semibold">Lekárske poznámky</h3>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            setEditingDoctorNotes(selectedAnalysis.id)
                                                            setDoctorNotesText(selectedAnalysis.doctorNotes || "")
                                                        }}
                                                    >
                                                        <Edit3 className="h-4 w-4" />
                                                    </Button>
                                                </div>

                                                {editingDoctorNotes === selectedAnalysis.id ? (
                                                    <div className="space-y-3">
                                                        <Textarea
                                                            placeholder="Pridajte lekárske poznámky k tejto analýze..."
                                                            value={doctorNotesText}
                                                            onChange={(e) => setDoctorNotesText(e.target.value)}
                                                            rows={4}
                                                        />
                                                        <div className="flex gap-2">
                                                            <Button size="sm" onClick={() => handleSaveDoctorNotes(selectedAnalysis.id)}>
                                                                Uložiť
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => {
                                                                    setEditingDoctorNotes(null)
                                                                    setDoctorNotesText("")
                                                                }}
                                                            >
                                                                Zrušiť
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-sm text-muted-foreground">
                                                        {selectedAnalysis.doctorNotes ? (
                                                            <div className="whitespace-pre-wrap break-words overflow-wrap-anywhere bg-blue-50 p-3 rounded border-l-4 border-blue-200">
                                                                {selectedAnalysis.doctorNotes}
                                                            </div>
                                                        ) : (
                                                            <div className="text-center py-4 text-muted-foreground">
                                                                Žiadne lekárske poznámky. Kliknite na tlačidlo úprav pre pridanie poznámok.
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
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
