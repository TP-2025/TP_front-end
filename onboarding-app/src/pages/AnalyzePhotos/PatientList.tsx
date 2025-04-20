"use client"

import { useState } from "react"
import { Search, User } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"

type Patient = {
    id: number
    name: string
    email: string
}

type PatientListProps = {
    patients: Patient[]
    selectedPatient: Patient | null
    onSelectPatient: (patient: Patient) => void
}

export default function PatientList({ patients, selectedPatient, onSelectPatient }: PatientListProps) {
    const [searchTerm, setSearchTerm] = useState("")

    const filteredPatients = patients.filter(
        (patient) =>
            patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    return (
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Hľadaj pacientov..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <ScrollArea className="h-[350px] pr-5">
                {filteredPatients.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">Pacient nebol nájdený</div>
                ) : (
                    <div className="space-y-2">
                        {filteredPatients.map((patient) => (
                            <div
                                key={patient.id}
                                className={`p-3 rounded-md cursor-pointer transition-colors flex items-center ${
                                    selectedPatient?.id === patient.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                                }`}
                                onClick={() => onSelectPatient(patient)}
                            >
                                <div className="h-8 w-8 rounded-full bg-muted-foreground/20 flex items-center justify-center mr-3">
                                    <User className="h-4 w-4" />
                                </div>
                                <div>
                                    <div className="font-medium">{patient.name}</div>
                                    <div className="text-sm opacity-80">{patient.email}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </ScrollArea>
        </div>
    )
}
