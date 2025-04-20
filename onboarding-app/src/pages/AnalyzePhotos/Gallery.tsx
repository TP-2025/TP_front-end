"use client"

import { useState, useEffect } from "react"
import { Calendar, Eye } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


const generatePhotosForPatient = (patientId: number) => {
    const count = 3 + Math.floor(Math.random() * 5)
    return Array.from({ length: count }, (_, i) => ({
        id: `${patientId}-${i + 1}`,
        url: `/placeholder.svg?height=200&width=200&text=Eye+Photo+${i + 1}`,
        date: new Date(Date.now() - Math.random() * 10000000000).toISOString().split("T")[0],
        eye: Math.random() > 0.5 ? "Pravé" : "Ľavé",
        notes: `Poznámky k fotke ${i + 1}`,
    }))
}

export type Photo = {
    id: string
    url: string
    date: string
    eye: string
    notes: string
}

type PhotoGalleryProps = {
    patientId: number | undefined
    onSelectPhoto: (photo: Photo | null) => void
    selectedPhoto: Photo | null
}

type SortOption = "date-newest" | "date-oldest" | "eye-left" | "eye-right"

export default function PhotoGallery({ patientId, onSelectPhoto, selectedPhoto }: PhotoGalleryProps) {
    const [photos, setPhotos] = useState<Photo[]>([])
    const [sortOption, setSortOption] = useState<SortOption>("date-newest")

    useEffect(() => {
        if (patientId) {
            // In a real app, this would be an API call
            const patientPhotos = generatePhotosForPatient(patientId)
            setPhotos(patientPhotos)
            onSelectPhoto(null)
        }
    }, [patientId, onSelectPhoto])

    const sortedPhotos = [...photos].sort((a, b) => {
        switch (sortOption) {
            case "date-newest":
                return new Date(b.date).getTime() - new Date(a.date).getTime()
            case "date-oldest":
                return new Date(a.date).getTime() - new Date(b.date).getTime()
            case "eye-left":
                return a.eye === "Left" ? -1 : 1
            case "eye-right":
                return a.eye === "Right" ? -1 : 1
            default:
                return 0
        }
    })

    if (!patientId) {
        return <div className="text-center p-4">Vyber pacienta</div>
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
                    </SelectContent>
                </Select>
            </div>

            <ScrollArea className="h-[270px]">
                <div className="p-2">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {sortedPhotos.map((photo) => (
                            <div
                                key={photo.id}
                                className={`relative cursor-pointer rounded-md overflow-hidden border-2 transition-all ${
                                    selectedPhoto?.id === photo.id ? "border-primary ring-2 ring-primary" : "border-border"
                                }`}
                                onClick={() => onSelectPhoto(photo)}
                            >
                                <img
                                    src={photo.url || "/placeholder.svg"}
                                    alt={`Eye photo ${photo.id}`}
                                    className="w-full h-auto object-cover aspect-square"
                                />

                                <div className="absolute bottom-0 left-0 right-0 bg-background/80 p-1 text-xs">
                                    <div className="font-medium">{photo.eye} Eye</div>
                                    <div>{photo.date}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </ScrollArea>
        </div>
    )
}
