import { Calendar, FileText, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Photo = {
    id: string
    url: string
    date: string
    eye: string
    notes: string
} | null

type PhotoInfoProps = {
    photo: Photo
}

export default function PhotoInfo({ photo }: PhotoInfoProps) {
    if (!photo) {
        return (
            <Card className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center p-4">
                    <FileText className="h-10 w-10 mx-auto mb-2 opacity-50" />
                    <p>Vyber fotku na analýzu</p>
                </div>
            </Card>
        )
    }

    return (
        <Card className="h-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Informácie o fotke
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-start gap-2">
                        <Eye className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <div>
                            <div className="font-medium">Oko</div>
                            <div>{photo.eye}</div>
                        </div>
                    </div>

                    <div className="flex items-start gap-2">
                        <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <div>
                            <div className="font-medium">Dátum fotenia</div>
                            <div>{photo.date}</div>
                        </div>
                    </div>

                    <div className="flex items-start gap-2">
                        <FileText className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <div>
                            <div className="font-medium">Poznámky</div>
                            <div className="text-sm">{photo.notes}</div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
