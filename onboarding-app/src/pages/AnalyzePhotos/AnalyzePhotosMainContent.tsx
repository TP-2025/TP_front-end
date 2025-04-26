"use client"

import { useState } from "react"
import { Eye, User, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

import PatientList from "./PatientList"
import PhotoGallery from "./Gallery"
import PhotoInfo from "./PhotoInfo"
import PatientInfo from "./PatientInfo"
import type { Photo } from "./Gallery"

const patients = [
    {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        gender: "Muž",
        age: 45,
        birthDate: "1979-05-12",
    },
    {
        id: 2,
        name: "Jane Smith",
        email: "jane.smith@example.com",
        gender: "Žena",
        age: 32,
        birthDate: "1992-08-24",
    },
    {
        id: 3,
        name: "Robert Johnson",
        email: "robert.j@example.com",
        gender: "Muž",
        age: 58,
        birthDate: "1966-03-17",
    },
    {
        id: 4,
        name: "Emily Davis",
        email: "emily.davis@example.com",
        gender: "Žena",
        age: 27,
        birthDate: "1997-11-03",
    },
    {
        id: 5,
        name: "Michael Wilson",
        email: "m.wilson@example.com",
        gender: "Muž",
        age: 63,
        birthDate: "1961-01-30",
    },
    {
        id: 6,
        name: "Sarah Brown",
        email: "sarah.b@example.com",
        gender: "Žena",
        age: 41,
        birthDate: "1983-07-19",
    },
    {
        id: 7,
        name: "David Miller",
        email: "david.miller@example.com",
        gender: "Muž",
        age: 52,
        birthDate: "1972-09-05",
    },
    {
        id: 8,
        name: "Lisa Taylor",
        email: "lisa.t@example.com",
        gender: "Žena",
        age: 36,
        birthDate: "1988-04-22",
    },
    {
        id: 9,
        name: "James Anderson",
        email: "j.anderson@example.com",
        gender: "Muž",
        age: 49,
        birthDate: "1975-12-10",
    },
    {
        id: 10,
        name: "Patricia Thomas",
        email: "p.thomas@example.com",
        gender: "Žena",
        age: 55,
        birthDate: "1969-06-15",
    },
]

const analysisMethods = [
    { id: 1, name: "Analíza 1." },
    { id: 2, name: "Analíza 2." },
    { id: 3, name: "Analíza 3." },
]

export default function Home() {
    const [selectedPatient, setSelectedPatient] = useState(patients[0])
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
    const [selectedPhotos, setSelectedPhotos] = useState<Photo[]>([])
    const [selectedMethod, setSelectedMethod] = useState("")

    const handleSelectPhoto = (photo: Photo | null) => {
        // Only update selected photo if it's not null
        if (photo) {
            setSelectedPhoto(photo)

            // Toggle the photo in the selectedPhotos array
            if (selectedPhotos.some((p) => p.id === photo.id)) {
                setSelectedPhotos(selectedPhotos.filter((p) => p.id !== photo.id))
            } else {
                setSelectedPhotos([...selectedPhotos, photo])
            }
        }
    }

    const handlePatientChange = (patient: any) => {
        setSelectedPatient(patient)
        setSelectedPhoto(null)
        setSelectedPhotos([])
    }

    const handleAnalyze = () => {
        if (selectedPhotos.length === 0 || !selectedMethod) {
            alert("Prosím, vyberte aspoň jednu fotku a metódu analýzy")
            return
        }

        alert(`Posielam ${selectedPhotos.length} fotiek na analýzu: ${selectedMethod}`)
        // In a real app, this would call an API endpoint
    }

    return (
        <main className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Analýza očných fotografií pacientov</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Patient list section */}
                <Card className="flex flex-col h-full max-h-[600px]">
                    <h2 className="text-lg font-semibold mb-3 flex items-center pl-2">
                        <User className="mr-2 h-5 w-5" />
                        Pacienti
                    </h2>
                    <PatientList
                        patients={patients}
                        selectedPatient={selectedPatient}
                        onSelectPatient={handlePatientChange}
                    />
                </Card>
                {/* Photo gallery and info section */}
                <Card className="p-4 md:col-span-2">
                    <div className="flex flex-col h-full">
                        {/* Patient info section */}
                        <PatientInfo patient={selectedPatient} />

                        <Separator className="my-2" />

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-semibold flex items-center">
                                    <Eye className="mr-2 h-5 w-5" />
                                    Galéria fotografií
                                </h2>
                                <div className="text-sm">
                                    Vybraných fotiek: <Badge variant="outline">{selectedPhotos.length}</Badge>
                                    {selectedPhotos.length > 0 && (
                                        <Button variant="ghost" size="sm" className="ml-2" onClick={() => setSelectedPhotos([])}>
                                            Zrušiť výber
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-grow">
                                <PhotoGallery
                                    patientId={selectedPatient?.id}
                                    onSelectPhoto={handleSelectPhoto}
                                    selectedPhoto={selectedPhoto}
                                    selectedPhotos={selectedPhotos}
                                />

                                <PhotoInfo photo={selectedPhoto} />
                            </div>

                            {selectedPhotos.length > 0 && (
                                <div className="mt-4">
                                    <h3 className="text-sm font-medium mb-2">Vybrané fotky</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                        {selectedPhotos.map((photo) => (
                                            <div key={photo.id} className="relative border rounded-md p-2 flex items-center gap-2">
                                                <div className="w-10 h-10 relative rounded overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={photo.url || "/placeholder.svg"}
                                                        alt={`Thumbnail ${photo.id}`}
                                                        className="object-cover w-full h-full"
                                                    />
                                                </div>
                                                <div className="text-xs truncate">
                                                    <div className="font-medium">{photo.eye} oko</div>
                                                    <div className="text-muted-foreground">{photo.date}</div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 p-0 ml-auto"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setSelectedPhotos(selectedPhotos.filter((p) => p.id !== photo.id))
                                                    }}
                                                >
                                                    <Check className="h-4 w-4" />
                                                    <span className="sr-only">Odstrániť</span>
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <Separator className="my-4" />

                        {/* Analysis section */}
                        <div className="mt-auto">
                            <h3 className="font-medium mb-2">Možnosti analýzy</h3>
                            <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                                <Select value={selectedMethod} onValueChange={setSelectedMethod}>
                                    <SelectTrigger className="w-full sm:w-[300px]">
                                        <SelectValue placeholder="Vyberte metódu analýzy" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {analysisMethods.map((method) => (
                                            <SelectItem key={method.id} value={method.name}>
                                                {method.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button
                                    onClick={handleAnalyze}
                                    disabled={selectedPhotos.length === 0 || !selectedMethod}
                                    className="w-full sm:w-auto"
                                >
                                    {`Analyzovať ${selectedPhotos.length} fotiek`}
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </main>
    )
}
