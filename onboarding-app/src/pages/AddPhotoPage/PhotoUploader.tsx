"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
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
import { getCameras, type CameraItem } from "@/api/settingsApi"
import { getAdditionalDevices } from "@/api/settingsApi"
import { format } from "date-fns"

interface AdditionalDevice {
    id: number
    name: string
}

interface PhotoInfo {
    id: string
    url: string
    name: string
    patient: Patient | null
    notes: string
    eye: "left" | "right" | null
    device: string | null
    additionalDevice: string | null
    quality: "dobrá" | "zlá" | null
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
    const [selectedQuality, setSelectedQuality] = useState<"dobrá" | "zlá" | null>(null)
    const [dateTaken, setDateTaken] = useState(() => new Date().toISOString().split("T")[0])
    const { roleId } = useAuth()

    const [cameras, setCameras] = useState<CameraItem[]>([])

    const [isUploading, setIsUploading] = useState(false)
    const [uploadError, setUploadError] = useState<string | null>(null)

    const [additionalDevices, setAdditionalDevices] = useState<AdditionalDevice[]>([])

    const [isLoadingPatients, setIsLoadingPatients] = useState(true)
    const [isLoadingCameras, setIsLoadingCameras] = useState(true)
    const [isLoadingAdditionalDevices, setIsLoadingAdditionalDevices] = useState(true)

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                setIsLoadingPatients(true)
                const response =
                    roleId === 4 || roleId === 2
                        ? await import("@/api/patientApi").then((mod) => mod.getPatients())
                        : await getMyPatients()

                setPatients(response)
            } catch (error) {
                console.error("❌ Failed to load patients:", error)
                setPatients([])
            } finally {
                setIsLoadingPatients(false)
            }
        }

        fetchPatients()
    }, [roleId])

    useEffect(() => {
        const fetchPatientsAndDevices = async () => {
            try {
                setIsLoadingPatients(true)
                const patientsData =
                    roleId === 4 || roleId === 2
                        ? await import("@/api/patientApi").then((mod) => mod.getPatients())
                        : await getMyPatients()
                setPatients(patientsData)
            } catch (error) {
                console.error("❌ Failed to load patients:", error)
            } finally {
                setIsLoadingPatients(false)
            }

            try {
                setIsLoadingCameras(true)
                const cameraData = await getCameras()
                setCameras(cameraData)
            } catch (error) {
                console.error("❌ Failed to load cameras:", error)
            } finally {
                setIsLoadingCameras(false)
            }

            try {
                setIsLoadingAdditionalDevices(true)
                const additionalData = await getAdditionalDevices()
                setAdditionalDevices(additionalData)
            } catch (error) {
                console.error("❌ Failed to load additional devices:", error)
            } finally {
                setIsLoadingAdditionalDevices(false)
            }
        }

        fetchPatientsAndDevices()
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
            setUploadError("Please select an image file.")
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
    }

    const savePhotoInfo = async () => {
        if (!photo || !photoFile || !selectedPatient) {
            setUploadError("Musíte nahrať fotku a vybrať pacienta.")
            return
        }

        if (selectedQuality !== "dobrá" && selectedQuality !== "zlá") {
            setUploadError("Kvalita musí byť 'dobrá' alebo 'zlá'")
            return
        }

        setIsUploading(true)
        setUploadError(null)

        try {
            await uploadPhotoWithMetadata(photoFile, {
                patient_id: selectedPatient.id,
                device_id: selectedDevice && selectedDevice !== "none" ? Number(selectedDevice) : undefined,
                additional_equipment_id:
                    selectedAdditionalDevice && selectedAdditionalDevice !== "none"
                        ? Number(selectedAdditionalDevice)
                        : undefined,
                quality: selectedQuality === "dobrá" ? "Dobra" : "Zla",
                technic_notes: notes || undefined,
                eye: selectedEye === "left" ? "l" : selectedEye === "right" ? "r" : undefined,
                date: format(new Date(dateTaken), "dd.MM.yyyy"),
                technician_id: undefined,
            })

            // Success - reset form
            resetForm()
            setUploadError(null)
        } catch (error) {
            console.error("❌ Upload failed:", error)
            setUploadError("Chyba pri nahrávaní. Skontrolujte spojenie alebo údaje a skúste znova.")
        } finally {
            setIsUploading(false)
        }
    }

    const removePhoto = () => {
        if (photo?.url) URL.revokeObjectURL(photo.url)
        setPhoto(null)
        setPhotoFile(null)
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
        setUploadError(null)
        removePhoto()
    }

    useEffect(() => {
        if (selectedPatient) setInputValue(selectedPatient.name)
    }, [selectedPatient])

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:max-h-screen md:overflow-hidden">
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
            <Card className="pt-2 px-4 pb-4 md:max-h-screen md:overflow-y-auto">
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
                                    <CommandEmpty>{isLoadingPatients ? "Načítavam pacientov..." : "Pacient nebol nájdený."}</CommandEmpty>
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
                                        {isLoadingCameras ? (
                                            <SelectItem value="loading" disabled>
                                                Načítavam zariadenia...
                                            </SelectItem>
                                        ) : cameras.length === 0 ? (
                                            <SelectItem value="none" disabled>
                                                Žiadne zariadenia
                                            </SelectItem>
                                        ) : (
                                            cameras.map((camera) => (
                                                <SelectItem key={camera.id} value={String(camera.id)}>
                                                    {camera.name} ({camera.type})
                                                </SelectItem>
                                            ))
                                        )}
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
                                        {isLoadingAdditionalDevices ? (
                                            <SelectItem value="loading" disabled>
                                                Načítavam zariadenia...
                                            </SelectItem>
                                        ) : (
                                            <>
                                                <SelectItem value="none">Žiadne</SelectItem>
                                                {additionalDevices.map((device) => (
                                                    <SelectItem key={device.id} value={String(device.id)}>
                                                        {device.name}
                                                    </SelectItem>
                                                ))}
                                            </>
                                        )}
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
                                onValueChange={(value) => setSelectedQuality(value as "dobrá" | "zlá")}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Vyber kvalitu..." />
                                </SelectTrigger>
                                <SelectContent>
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

                    {uploadError && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-600">{uploadError}</p>
                        </div>
                    )}

                    <div className="flex space-x-2">
                        <Button onClick={savePhotoInfo} className="flex-1" disabled={!photo || isUploading}>
                            {isUploading ? "Ukladám..." : "Ulož informácie"}
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
