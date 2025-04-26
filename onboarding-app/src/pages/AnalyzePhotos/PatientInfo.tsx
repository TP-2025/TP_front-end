import { Mail, User, Calendar, Users } from "lucide-react"

type Patient = {
    id: number
    name: string
    email: string
    gender: string
    age: number
    birthDate: string
}

type PatientInfoProps = {
    patient: Patient | null
}

export default function PatientInfo({ patient }: PatientInfoProps) {
    if (!patient) {
        return null
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("sk-SK", { day: "2-digit", month: "2-digit", year: "numeric" })
    }

    return (
        <div className="bg-muted/30 rounded-lg p-2">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                </div>

                <div className="space-y-1">
                    <h3 className="text-xl font-semibold">{patient.name}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                        <Mail className="mr-2 h-4 w-4" />
                        {patient.email}
                    </div>
                </div>

                <div className="sm:ml-auto flex flex-wrap gap-3 mt-2 sm:mt-0">
                    <div className="bg-background rounded-md px-4 py-3 text-sm flex flex-col items-center">
                        <span className="text-muted-foreground text-sm">Pohlavie</span> {/* text-sm instead of text-xs */}
                        <div className="flex items-center mt-1 text-base">
                            <Users className="mr-1 h-6 w-6 text-primary" /> {/* icons bigger */}
                            <span>{patient.gender}</span>
                        </div>
                    </div>

                    <div className="bg-background rounded-md px-4 py-3 text-sm flex flex-col items-center">
                        <span className="text-muted-foreground text-sm">Vek</span> {/* text-sm */}
                        <div className="flex items-center mt-1 text-base">
                            <span>{patient.age} rokov</span>
                        </div>
                    </div>

                    <div className="bg-background rounded-md px-4 py-3 text-sm flex flex-col items-center">
                        <span className="text-muted-foreground text-sm">Dátum narodenia</span> {/* text-sm */}
                        <div className="flex items-center mt-1 text-base">
                            <Calendar className="mr-1 h-6 w-6 text-primary" /> {/* bigger */}
                            <span>{formatDate(patient.birthDate)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
