"use client"

import type React from "react"
import { useState } from "react"
import { Plus, Camera, Target, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function Settings() {
    const [activeTab, setActiveTab] = useState("cameras")

    const [cameraForm, setCameraForm] = useState({ name: "", description: "" })
    const [accessoryForm, setAccessoryForm] = useState({ name: "", description: "" })
    const [analysisForm, setAnalysisForm] = useState({ name: "", description: "" })

    const handleAddCamera = (e: React.FormEvent) => {
        e.preventDefault()
        if (!cameraForm.name.trim()) return
        console.log("Pridávam kameru:", cameraForm)
        setCameraForm({ name: "", description: "" })
    }

    const handleAddAccessory = (e: React.FormEvent) => {
        e.preventDefault()
        if (!accessoryForm.name.trim()) return
        console.log("Pridávam prídavné zariadenie:", accessoryForm)
        setAccessoryForm({ name: "", description: "" })
    }

    const handleAddAnalysis = (e: React.FormEvent) => {
        e.preventDefault()
        if (!analysisForm.name.trim()) return
        console.log("Pridávam analýzu:", analysisForm)
        setAnalysisForm({ name: "", description: "" })
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Nastavenia</h1>
                <p className="text-muted-foreground mt-2">
                    Spravujte svoje zariadenia, prídavné zariadenia a typy analýz
                </p>
            </div>

            <div className="mb-6">
                <div className="flex space-x-1 bg-muted p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab("cameras")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            activeTab === "cameras"
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        <Camera className="w-4 h-4" />
                        Kamery
                    </button>
                    <button
                        onClick={() => setActiveTab("accessories")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            activeTab === "accessories"
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        <Target className="w-4 h-4" />
                        Prídavné zariadenia
                    </button>
                    <button
                        onClick={() => setActiveTab("analyses")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            activeTab === "analyses"
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        <BarChart3 className="w-4 h-4" />
                        Analýzy
                    </button>
                </div>
            </div>

            {activeTab === "cameras" && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Camera className="w-5 h-5" />
                            Pridať novú kameru
                        </CardTitle>
                        <CardDescription>Pridajte nové kamerové zariadenie do systému</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAddCamera} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="camera-name">Názov kamery *</Label>
                                <Input
                                    id="camera-name"
                                    placeholder="napr. Hlavná kamera v laboratóriu"
                                    value={cameraForm.name}
                                    onChange={(e) => setCameraForm((prev) => ({ ...prev, name: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="camera-description">Popis</Label>
                                <Textarea
                                    id="camera-description"
                                    placeholder="Voliteľný popis kamery..."
                                    value={cameraForm.description}
                                    onChange={(e) => setCameraForm((prev) => ({ ...prev, description: e.target.value }))}
                                    rows={3}
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                <Plus className="w-4 h-4 mr-2" />
                                Pridať kameru
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            {activeTab === "accessories" && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="w-5 h-5" />
                            Pridať nové prídavné zariadenie
                        </CardTitle>
                        <CardDescription>Pridajte nové prídavné zariadenie pre vaše kamery</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAddAccessory} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="accessory-name">Názov zariadenia *</Label>
                                <Input
                                    id="accessory-name"
                                    placeholder="napr. Infračervený modul"
                                    value={accessoryForm.name}
                                    onChange={(e) => setAccessoryForm((prev) => ({ ...prev, name: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="accessory-description">Popis</Label>
                                <Textarea
                                    id="accessory-description"
                                    placeholder="Voliteľný popis zariadenia..."
                                    value={accessoryForm.description}
                                    onChange={(e) => setAccessoryForm((prev) => ({ ...prev, description: e.target.value }))}
                                    rows={3}
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                <Plus className="w-4 h-4 mr-2" />
                                Pridať zariadenie
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            {activeTab === "analyses" && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5" />
                            Pridať nový typ analýzy
                        </CardTitle>
                        <CardDescription>Pridajte nový typ analýzy do systému</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAddAnalysis} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="analysis-name">Názov analýzy *</Label>
                                <Input
                                    id="analysis-name"
                                    placeholder="napr. Počítanie buniek"
                                    value={analysisForm.name}
                                    onChange={(e) => setAnalysisForm((prev) => ({ ...prev, name: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="analysis-description">Popis</Label>
                                <Textarea
                                    id="analysis-description"
                                    placeholder="Popíšte, čo táto analýza robí..."
                                    value={analysisForm.description}
                                    onChange={(e) => setAnalysisForm((prev) => ({ ...prev, description: e.target.value }))}
                                    rows={3}
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                <Plus className="w-4 h-4 mr-2" />
                                Pridať analýzu
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
