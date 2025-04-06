import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useNavigate } from "react-router-dom"

import { DropdownRole } from "@/components/loginRole"
import { Help } from "../../../../../Team Project Front END/TP_front-end/onboarding-app/src/components/Help"
import { i18n } from "@/lib/i18n"

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
    const [lang, setLang] = useState<"sk" | "en">("sk")
    const [role, setRole] = useState(i18n[lang].chooseRole)
    const navigate = useNavigate()

    const t = i18n[lang] // aktuálne preklady

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const form = e.currentTarget as HTMLFormElement
        const email = (form.elements.namedItem("email") as HTMLInputElement).value
        const password = (form.elements.namedItem("password") as HTMLInputElement).value

        if (role === t.chooseRole) {
            alert(t.selectRoleAlert)
            return
        }

        console.log("📦 Submitted values:", {
            email,
            password,
            role
        })

        alert(t.loginSuccess)

        if (role === "admin") {
            navigate("/admin")
        } else if (role === "doktor") {
            navigate("/doktor")
        } else if (role === "pacient") {
            navigate("/pacient")
        } else if (role === "moderator") {
            navigate("/moderator")
        } else {
            navigate("/home")
        }
    }

    const toggleLang = () => {
        const newLang = lang === "sk" ? "en" : "sk"
        setLang(newLang)
        setRole(i18n[newLang].chooseRole)
    }

    return (
        <div className={cn("flex w-full h-screen items-center justify-center", className)} {...props}>
            <div className="flex w-full max-w-7xl items-center justify-between">
                {/* Logo a názov spoločnosti na ľavej strane */}
                <div className="flex items-center gap-4">
                    <img src="/logo.png" alt="Logo" className="w-16 h-16" />
                    <h1 className="text-2xl font-semibold">Názov spoločnosti</h1>
                </div>

                {/* Login formulár na pravej strane */}
                <Card className="w-full max-w-md p-5 shadow-lg border rounded-xl bg-white">
                    <CardHeader>
                        <CardTitle className="text-2xl">{t.login}</CardTitle>
                        <CardDescription>{t.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="role">{t.role}</Label>
                                    <DropdownRole role={role} setRole={setRole} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">{t.email}</Label>
                                    <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">{t.password}</Label>
                                        <a href="#" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                                            {t.forgotPassword}
                                        </a>
                                    </div>
                                    <Input id="password" name="password" type="password" required />
                                </div>
                                <div className="flex justify-between w-full">
                                    <Button type="submit" className="w-40">
                                        {t.login}
                                    </Button>
                                    <Button type="button" onClick={toggleLang} className="w-25 bg-gray-300 text-gray-800 hover:bg-gray-400">
                                        {t.language}
                                    </Button>
                                    {/* Tu posielam jazyk do komponentu Help */}
                                    <Help lang={lang} />
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
