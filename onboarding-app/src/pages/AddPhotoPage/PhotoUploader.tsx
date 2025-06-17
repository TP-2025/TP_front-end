"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { toast } from "sonner"
import { Upload, X, Check, User, Mail } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { getMyPatients, type Patient } from "@/api/patientApi"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/Security/authContext"
import { uploadPhotoWithMetadata } from "@/api/addPhotoApi"

interface PhotoInfo {
    id: string
    url: string
    name: string
    patient: Patient | null
    notes: string
    eye: "left" | "right" | null
    device: string | null
    additionalDevice: string | null
    quality: "vyborná" | "dobrá" | "zlá" | null
    dateTaken: string
}

export function PhotoUploader() {
    const [patients, setPatients] = useState<Patient[]>([])
    const [photo, setPhoto] = useState<PhotoInfo | null>(null)
    const [photoFile, setPhotoFile] = useState<File | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Form state
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
    const [notes, setNotes] = useState("")
    const [selectedEye, setSelectedEye] = useState<"left" | "right" | null>(null)
    const [open, setOpen] = useState(false)
    const [inputValue, setInputValue] = useState("")
    const [selectedDevice, setSelectedDevice] = useState<string | null>(null)
    const [selectedAdditionalDevice, setSelectedAdditionalDevice] = useState<string | null>(null)
    const [selectedQuality, setSelectedQuality] = useState<"vyborná" | "dobrá" | "zlá" | null>(null)
    const [dateTaken, setDateTaken] = useState(() => new Date().toISOString().split("T")[0])
    const { roleId } = useAuth()

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response =
                    roleId === 4 || roleId === 2
                        ? await import("@/api/patientApi").then((mod) => mod.getPatients())
                        : await getMyPatients()

                setPatients(response)
            } catch (error) {
                console.error("❌ Failed to load patients:", error)
                setPatients([])
            }
        }

        fetchPatients()
    }, [roleId])

    const filteredPatients = patients.filter((patient) => {
        if (!inputValue) return true
        return (
            patient.name.toLowerCase().includes(inputValue.toLowerCase()) ||
            patient.email.toLowerCase().includes(inputValue.toLowerCase())
        )
    })

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)
        if (e.dataTransfer.files?.length > 0) {
            handleFile(e.dataTransfer.files[0])
        }
    }

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            handleFile(files[0])
        }
    }

    const handleFile = (file: File) => {
        if (!file.type.startsWith("image/")) {
            toast.error("Invalid file type", {
                description: "Please select an image file.",
            })
            return
        }

        if (photo?.url) URL.revokeObjectURL(photo.url)

        const newPhoto: PhotoInfo = {
            id: Math.random().toString(36).substring(2, 9),
            url: URL.createObjectURL(file),
            name: file.name,
            patient: selectedPatient,
            notes,
            eye: selectedEye,
            device: selectedDevice,
            additionalDevice: selectedAdditionalDevice,
            quality: selectedQuality,
            dateTaken,
        }

        setPhoto(newPhoto)
        setPhotoFile(file)

        toast.success("Photo uploaded", {
            description: "Your photo has been uploaded successfully.",
        })
    }

    const savePhotoInfo = async () => {
        ///////////////////////////if (!photo || !photoFile || !selectedPatient) {
        if (!photo || !photoFile || !selectedPatient) {
            toast.error("Chýbajúce údaje", {
                description: "Musíte nahrať fotku a vybrať pacienta.",
            })
            return
        }

        if (selectedQuality !== "dobrá" && selectedQuality !== "zlá") {
            toast.error("Kvalita musí byť 'dobrá' alebo 'zlá'")
            return
        }

        try {
            await uploadPhotoWithMetadata(photoFile, {
                patient_id: selectedPatient.id,
                device_id: undefined, // Update when real device IDs available
                additional_equipment_id: undefined,
                quality: selectedQuality === "dobrá" ? "Dobra" : "Zla",
                technic_notes: notes,
                eye: selectedEye === "left" ? "l" : selectedEye === "right" ? "r" : undefined,
                date: dateTaken,
                technician_id: undefined,
            })

            toast.success("Informácie uložené", {
                description: "Fotka a metadáta boli úspešne odoslané.",
            })

            // Optional: reset form if upload succeeds
            resetForm()

        } catch (error) {
            console.error("❌ Upload failed:", error)
            toast.error("Chyba pri nahrávaní", {
                description: "Skontrolujte spojenie alebo údaje.",
            })
        }
    }


    const removePhoto = () => {
        if (photo?.url) URL.revokeObjectURL(photo.url)
        setPhoto(null)
        setPhotoFile(null)
        toast.info("Foto odstránené", {
            description: "Fotka bola odstránená.",
        })
    }

    const resetForm = () => {
        setSelectedPatient(null)
        setInputValue("")
        setNotes("")
        setSelectedEye(null)
        setSelectedDevice(null)
        setSelectedAdditionalDevice(null)
        setSelectedQuality(null)
        setDateTaken(() => new Date().toISOString().split("T")[0])
        removePhoto()
    }

    useEffect(() => {
        if (selectedPatient) setInputValue(selectedPatient.name)
    }, [selectedPatient])


    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-screen overflow-hidden">
            {/* Left side - Photo upload and preview */}
            <div className="space-y-4">
                {!photo ? (
                    <div
                        className={cn(
                            "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center h-[280px] transition-colors",
                            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
                        )}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
                        <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-1">Presuň sem fotku</h3>
                        <p className="text-sm text-muted-foreground mb-4 text-center">alebo vyber fotku zo súborov</p>
                        <Button
                            variant="outline"
                            onClick={(e) => {
                                e.stopPropagation()
                                fileInputRef.current?.click()
                            }}
                        >
                            Vyber fotku
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="relative rounded-lg overflow-hidden border">
                            <img
                                src={photo.url || "/placeholder.svg"}
                                alt={photo.name}
                                className="w-full object-contain max-h-[350px]"
                            />
                            <button
                                className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-2 hover:bg-black/90 transition-colors"
                                onClick={removePhoto}
                            >
                                <X className="h-4 w-4" />
                                <span className="sr-only">Remove</span>
                            </button>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground truncate max-w-[80%]">{photo.name}</span>
                            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                                Change Photo
                            </Button>
                            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
                        </div>
                    </div>
                )}
            </div>

            {/* Right side - Photo information form */}
            <Card className="pt-2 px-4 pb-4 max-h-screen overflow-y-auto">
                <h3 className="text-lg font-medium mb-2">Informácie o fotke</h3>

                <div className="space-y-3">
                    <div className="space-y-2">
                        <Label htmlFor="patientName">Pacient</Label>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                                    {selectedPatient ? (
                                        <div className="flex items-center">
                                            <User className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                                            <span>{selectedPatient.name}</span>
                                        </div>
                                    ) : (
                                        <span className="text-muted-foreground">Vyber pacienta...</span>
                                    )}
                                    <X
                                        className={cn("ml-2 h-4 w-4 shrink-0 opacity-50", !selectedPatient && "hidden")}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setSelectedPatient(null)
                                            setInputValue("")
                                        }}
                                    />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px] p-0">
                                <Command>
                                    <CommandInput placeholder="Search patients..." value={inputValue} onValueChange={setInputValue} />
                                    <CommandEmpty>Pacient nebol nájdený.</CommandEmpty>
                                    <CommandList>
                                        <CommandGroup>
                                            {filteredPatients.map((patient) => (
                                                <CommandItem
                                                    key={patient.id}
                                                    value={patient.name}
                                                    onSelect={() => {
                                                        setSelectedPatient(patient)
                                                        setOpen(false)
                                                    }}
                                                >
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center">
                                                            <User className="mr-2 h-4 w-4 shrink-0 opacity-70" />
                                                            <span>{patient.name}</span>
                                                            {selectedPatient?.id === patient.id && <Check className="ml-auto h-4 w-4" />}
                                                        </div>
                                                        <div className="flex items-center text-xs text-muted-foreground ml-6">
                                                            <Mail className="mr-1 h-3 w-3 shrink-0 opacity-70" />
                                                            {patient.email}
                                                        </div>
                                                    </div>
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="space-y-2">
                        <Label>Výber oka</Label>
                        <RadioGroup value={selectedEye || ""} onValueChange={(value) => setSelectedEye(value as "left" | "right")}>
                            <div className="flex space-x-4">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="left" id="leftEye" />
                                    <Label htmlFor="leftEye" className="cursor-pointer">
                                        Ľavé oko
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="right" id="rightEye" />
                                    <Label htmlFor="rightEye" className="cursor-pointer">
                                        Pravé oko
                                    </Label>
                                </div>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="space-y-2">
                        <Label>Zariadenia</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label htmlFor="device" className="text-sm text-muted-foreground">
                                    Hlavné zariadenie
                                </Label>
                                <Select value={selectedDevice || ""} onValueChange={setSelectedDevice}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Vyber hlavné zariadenie..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="fundus-camera-1">Fundus Camera - Model A</SelectItem>
                                        <SelectItem value="fundus-camera-2">Fundus Camera - Model B</SelectItem>
                                        <SelectItem value="oct-scanner-1">OCT Scanner - Cirrus HD</SelectItem>
                                        <SelectItem value="oct-scanner-2">OCT Scanner - Spectralis</SelectItem>
                                        <SelectItem value="slit-lamp-1">Slit Lamp - Haag Streit</SelectItem>
                                        <SelectItem value="slit-lamp-2">Slit Lamp - Zeiss</SelectItem>
                                        <SelectItem value="retinal-camera-1">Retinal Camera - Canon</SelectItem>
                                        <SelectItem value="retinal-camera-2">Retinal Camera - Topcon</SelectItem>
                                        <SelectItem value="corneal-topographer">Corneal Topographer</SelectItem>
                                        <SelectItem value="visual-field-analyzer">Visual Field Analyzer</SelectItem>
                                        <SelectItem value="pachymeter">Pachymeter</SelectItem>
                                        <SelectItem value="tonometer">Tonometer</SelectItem>
                                        <SelectItem value="biometer">Biometer</SelectItem>
                                        <SelectItem value="endothelial-microscope">Endothelial Microscope</SelectItem>
                                        <SelectItem value="other">Iné zariadenie</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="additionalDevice" className="text-sm text-muted-foreground">
                                    Pridavné zariadenie
                                </Label>
                                <Select value={selectedAdditionalDevice || ""} onValueChange={setSelectedAdditionalDevice}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Vyber pridavné zariadenie..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Žiadne</SelectItem>
                                        <SelectItem value="fundus-camera-1">Fundus Camera - Model A</SelectItem>
                                        <SelectItem value="fundus-camera-2">Fundus Camera - Model B</SelectItem>
                                        <SelectItem value="oct-scanner-1">OCT Scanner - Cirrus HD</SelectItem>
                                        <SelectItem value="oct-scanner-2">OCT Scanner - Spectralis</SelectItem>
                                        <SelectItem value="slit-lamp-1">Slit Lamp - Haag Streit</SelectItem>
                                        <SelectItem value="slit-lamp-2">Slit Lamp - Zeiss</SelectItem>
                                        <SelectItem value="retinal-camera-1">Retinal Camera - Canon</SelectItem>
                                        <SelectItem value="retinal-camera-2">Retinal Camera - Topcon</SelectItem>
                                        <SelectItem value="corneal-topographer">Corneal Topographer</SelectItem>
                                        <SelectItem value="visual-field-analyzer">Visual Field Analyzer</SelectItem>
                                        <SelectItem value="pachymeter">Pachymeter</SelectItem>
                                        <SelectItem value="tonometer">Tonometer</SelectItem>
                                        <SelectItem value="biometer">Biometer</SelectItem>
                                        <SelectItem value="endothelial-microscope">Endothelial Microscope</SelectItem>
                                        <SelectItem value="other-additional">Iné pridavné zariadenie</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <Label htmlFor="quality">Kvalita</Label>
                            <Select
                                value={selectedQuality || ""}
                                onValueChange={(value) => setSelectedQuality(value as "vyborná" | "dobrá" | "zlá")}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Vyber kvalitu..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="vyborná">Vyborná</SelectItem>
                                    <SelectItem value="dobrá">Dobrá</SelectItem>
                                    <SelectItem value="zlá">Zlá</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dateTaken">Dátum fotenia</Label>
                            <Input id="dateTaken" type="date" value={dateTaken} onChange={(e) => setDateTaken(e.target.value)} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Poznámky</Label>
                        <Textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Pridaj poznámky"
                            className="min-h-[60px]"
                        />
                    </div>

                    <div className="flex space-x-2">
                        <Button onClick={savePhotoInfo} className="flex-1" disabled={!photo}>
                            Ulož informácie
                        </Button>
                        <Button variant="outline" onClick={resetForm}>
                            Reset
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}
