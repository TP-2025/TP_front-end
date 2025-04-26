"use client"

import { useState, useEffect, useRef } from "react"
import { Calendar, Eye, Check } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Define the Photo type to match what's in PhotoInfo.tsx
export type Photo = {
    id: string
    url: string
    date: string
    eye: string
    notes: string
    analysis: "Analýza 1." | "Analýza 2." | "Analýza 3." | null
}

type PhotoGalleryProps = {
    patientId: number | undefined
    onSelectPhoto: (photo: Photo | null) => void
    selectedPhoto: Photo | null
    selectedPhotos: Photo[] // Add this prop to know which photos are selected for analysis
}

type SortOption = "date-newest" | "date-oldest" | "eye-left" | "eye-right" | "analyzed" | "not-analyzed"

export default function PhotoGallery({ patientId, onSelectPhoto, selectedPhoto, selectedPhotos }: PhotoGalleryProps) {
    const [photos, setPhotos] = useState<Photo[]>([])
    const [sortOption, setSortOption] = useState<SortOption>("date-newest")
    // Use a ref to track if photos have been generated for this patient
    const generatedPatientsRef = useRef<Set<number>>(new Set())

    // Generate photos for a patient
    const generatePhotosForPatient = (patientId: number) => {
        const count = 3 + Math.floor(Math.random() * 5)
        const analysisOptions = ["Analýza 1.", "Analýza 2.", "Analýza 3."] as const

        return Array.from({ length: count }, (_, i) => ({
            id: `${patientId}-${i + 1}`,
            url: `/placeholder.svg?height=200&width=200&text=Eye+Photo+${i + 1}`,
            date: new Date(Date.now() - Math.random() * 10000000000).toISOString().split("T")[0],
            eye: Math.random() > 0.5 ? "Pravé" : "Ľavé",
            notes: `Poznámky k fotke ${i + 1}`,
            analysis: Math.random() > 0.5 ? analysisOptions[Math.floor(Math.random() * analysisOptions.length)] : null,
        }))
    }

    useEffect(() => {
        if (patientId && !generatedPatientsRef.current.has(patientId)) {
            // Only generate photos if we haven't already for this patient
            const patientPhotos = generatePhotosForPatient(patientId)
            setPhotos(patientPhotos)
            generatedPatientsRef.current.add(patientId)
            onSelectPhoto(null) // Reset selected photo when patient changes
        }
    }, [patientId]) // Only depend on patientId, not onSelectPhoto

    const sortedPhotos = [...photos].sort((a, b) => {
        switch (sortOption) {
            case "date-newest":
                return new Date(b.date).getTime() - new Date(a.date).getTime()
            case "date-oldest":
                return new Date(a.date).getTime() - new Date(b.date).getTime()
            case "eye-left":
                return a.eye === "Ľavé" ? -1 : 1
            case "eye-right":
                return a.eye === "Pravé" ? -1 : 1
            case "analyzed":
                return (b.analysis ? 1 : 0) - (a.analysis ? 1 : 0)
            case "not-analyzed":
                return (a.analysis ? 1 : 0) - (b.analysis ? 1 : 0)
            default:
                return 0
        }
    })

    if (!patientId) {
        return <div className="text-center p-4">Vyber pacienta</div>
    }

    // Helper function to check if a photo is selected for analysis
    const isPhotoSelected = (photo: Photo) => {
        return selectedPhotos.some((p) => p.id === photo.id)
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div className="text-sm font-medium"> Počet fotiek: {photos.length}</div>
                <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
                    <SelectTrigger className="w-[180px] h-8 text-xs">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="date-newest">
                            <div className="flex items-center">
                                <Calendar className="mr-2 h-3.5 w-3.5" />
                                <span>Najnovšie</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="date-oldest">
                            <div className="flex items-center">
                                <Calendar className="mr-2 h-3.5 w-3.5" />
                                <span>Najstaršie</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="eye-left">
                            <div className="flex items-center">
                                <Eye className="mr-2 h-3.5 w-3.5" />
                                <span>Ľavé oko</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="eye-right">
                            <div className="flex items-center">
                                <Eye className="mr-2 h-3.5 w-3.5" />
                                <span>Pravé oko</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="analyzed">
                            <div className="flex items-center">
                                <Check className="mr-2 h-3.5 w-3.5" />
                                <span>Analyzované</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="not-analyzed">
                            <div className="flex items-center">
                                <Check className="mr-2 h-3.5 w-3.5" />
                                <span>Neanalyzované</span>
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <ScrollArea className="h-[270px]">
                <div className="p-2">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {sortedPhotos.map((photo) => {
                            const isSelected = isPhotoSelected(photo)
                            return (
                                <div
                                    key={photo.id}
                                    className={`relative cursor-pointer rounded-md overflow-hidden border-2 transition-all ${
                                        selectedPhoto?.id === photo.id
                                            ? "border-primary ring-2 ring-primary"
                                            : isSelected
                                                ? "border-green-500"
                                                : "border-border"
                                    }`}
                                    onClick={() => onSelectPhoto(photo)}
                                >
                                    <img
                                        src={photo.url || "/placeholder.svg"}
                                        alt={`Eye photo ${photo.id}`}
                                        className="w-full h-auto object-cover aspect-square"
                                    />

                                    <div className="absolute bottom-0 left-0 right-0 bg-background/80 p-1 text-xs">
                                        <div className="font-medium">{photo.eye} oko</div>
                                        <div>{photo.date}</div>
                                    </div>

                                    {photo.analysis && (
                                        <div className="absolute bottom-2 right-2 bg-green-700 text-white p-1 rounded-full">
                                            <Check className="h-4 w-4" />
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </ScrollArea>
        </div>
    )
}
