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

interface PhotoInfo {
    id: string
    url: string
    name: string
    patient: Patient | null
    notes: string
    eye: "left" | "right" | null
    device: string | null
}

export function PhotoUploader() {
    const [patients, setPatients] = useState<Patient[]>([])
    const [photo, setPhoto] = useState<PhotoInfo | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Form state
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
    const [notes, setNotes] = useState("")
    const [selectedEye, setSelectedEye] = useState<"left" | "right" | null>(null)
    const [open, setOpen] = useState(false)
    const [inputValue, setInputValue] = useState("")
    const [selectedDevice, setSelectedDevice] = useState<string | null>(null)

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await getMyPatients()
                setPatients(response)
            } catch (error) {
                console.error("❌ Failed to load patients:", error)
                setPatients([])
            }
        }

        fetchPatients()
    }, [])

    // Filter patients based on input
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

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0])
        }
    }

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFile(e.target.files[0])
        }
    }

    const handleFile = (file: File) => {
        if (!file.type.startsWith("image/")) {
            toast.error("Invalid file type", {
                description: "Please select an image file.",
            })
            return
        }

        if (photo?.url) {
            URL.revokeObjectURL(photo.url)
        }

        const newPhoto: PhotoInfo = {
            id: Math.random().toString(36).substring(2, 9),
            url: URL.createObjectURL(file),
            name: file.name,
            patient: selectedPatient,
            notes: notes,
            eye: selectedEye,
            device: selectedDevice,
        }

        setPhoto(newPhoto)

        toast.success("Photo uploaded", {
            description: "Your photo has been uploaded successfully.",
        })
    }

    const savePhotoInfo = () => {
        if (!photo) return

        const updatedPhoto = {
            ...photo,
            patient: selectedPatient,
            notes,
            eye: selectedEye,
            device: selectedDevice,
        }

        setPhoto(updatedPhoto)

        toast.success("Information saved", {
            description: "Photo information has been updated.",
        })
    }

    const removePhoto = () => {
        if (photo?.url) {
            URL.revokeObjectURL(photo.url)
        }

        setPhoto(null)

        toast.info("Photo removed", {
            description: "The photo has been removed.",
        })
    }

    const resetForm = () => {
        setSelectedPatient(null)
        setInputValue("")
        setNotes("")
        setSelectedEye(null)
        setSelectedDevice(null)
        removePhoto()
    }

    // Update input value when patient is selected
    useEffect(() => {
        if (selectedPatient) {
            setInputValue(selectedPatient.name)
        }
    }, [selectedPatient])

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left side - Photo upload and preview */}
            <div className="space-y-4">
                {!photo ? (
                    <div
                        className={cn(
                            "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center min-h-[300px] transition-colors",
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
                                className="w-full object-contain max-h-[400px]"
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
            <Card className="p-6">
                <h3 className="text-lg font-medium mb-4">Informácie o fotke</h3>

                <div className="space-y-4">
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
                        <Label htmlFor="device">Zariadenie</Label>
                        <Select value={selectedDevice || ""} onValueChange={setSelectedDevice}>
                            <SelectTrigger>
                                <SelectValue placeholder="Vyber zariadenie..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="device1">Device 1</SelectItem>
                                <SelectItem value="device2">Device 2</SelectItem>
                                <SelectItem value="device3">Device 3</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Poznámky</Label>
                        <Textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Pridaj poznámky"
                            className="min-h-[120px]"
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
