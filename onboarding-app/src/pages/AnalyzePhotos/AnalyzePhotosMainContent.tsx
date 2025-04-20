"use client"

import { useState } from "react"
import { Eye, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import PatientList from "./PatientList"
import PhotoGallery from "./Gallery"
import PhotoInfo from "./PhotoInfo"
import type { Photo } from "./Gallery"

// Sample data
const patients = [
    { id: 1, name: "John Doe", email: "john.doe@example.com" },
    { id: 2, name: "Jane Smith", email: "jane.smith@example.com" },
    { id: 3, name: "Robert Johnson", email: "robert.j@example.com" },
    { id: 4, name: "Emily Davis", email: "emily.davis@example.com" },
    { id: 5, name: "Michael Wilson", email: "m.wilson@example.com" },
    { id: 6, name: "Sarah Brown", email: "sarah.b@example.com" },
    { id: 7, name: "David Miller", email: "david.miller@example.com" },
    { id: 8, name: "Lisa Taylor", email: "lisa.t@example.com" },
    { id: 9, name: "James Anderson", email: "j.anderson@example.com" },
    { id: 10, name: "Patricia Thomas", email: "p.thomas@example.com" },
]

const analysisMethods = [
    { id: 1, name: "Analýza 1." },
    { id: 2, name: "Analýza 2." },
    { id: 3, name: "Analýza 3." },
]

export default function Home() {
    const [selectedPatient, setSelectedPatient] = useState(patients[0])
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
    const [selectedMethod, setSelectedMethod] = useState("")

    const handleAnalyze = () => {
        if (!selectedPhoto || !selectedMethod) {
            alert("Please select both a photo and an analysis method")
            return
        }

        alert(`Sending photo ${selectedPhoto.id} for ${selectedMethod} analysis`)
        // In a real app, this would call an API endpoint
    }

    return (
        <main className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Analýza fotiek</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Patient list section */}
                <Card className="p-4">
                    <h2 className="text-lg font-semibold mb-4 flex items-center">
                        <User className="mr-2 h-5 w-5" />
                        Pacienti
                    </h2>
                    <PatientList patients={patients} selectedPatient={selectedPatient} onSelectPatient={setSelectedPatient} />
                </Card>

                {/* Photo gallery and info section */}
                <Card className="p-4 md:col-span-2">
                    <div className="flex flex-col h-full">
                        <h2 className="text-lg font-semibold mb-4 flex items-center">
                            <Eye className="mr-2 h-5 w-5" />
                            Galéria: {selectedPatient?.name}
                        </h2>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-grow">
                            <PhotoGallery
                                patientId={selectedPatient?.id}
                                onSelectPhoto={setSelectedPhoto}
                                selectedPhoto={selectedPhoto}
                            />

                            <PhotoInfo photo={selectedPhoto} />
                        </div>

                        <Separator className="my-4" />

                        {/* Analysis section */}
                        <div className="mt-auto">
                            <h3 className="font-medium mb-2">Typ analýzy</h3>
                            <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                                <Select value={selectedMethod} onValueChange={setSelectedMethod}>
                                    <SelectTrigger className="w-full sm:w-[300px]">
                                        <SelectValue placeholder="Vyber metódu na analýzu" />
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
                                    disabled={!selectedPhoto || !selectedMethod}
                                    className="w-full sm:w-auto"
                                >
                                    Analyzuj fotku
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </main>
    )
}
