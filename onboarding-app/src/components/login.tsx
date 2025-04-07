import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useNavigate } from "react-router-dom"

import { DropdownRole } from "@/components/loginRole"
import { Help } from "@/components/Help"
import { i18n } from "@/lib/i18n"

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
    const [lang, setLang] = useState<"sk" | "en">("sk")
    const [role, setRole] = useState(i18n[lang].chooseRole)
    const [passwordVisible, setPasswordVisible] = useState(false)
    const navigate = useNavigate()

    /*
    e.preventDefault()

    const form = e.currentTarget as HTMLFormElement
    const email = (form.elements.namedItem("email") as HTMLInputElement).value
    const password = (form.elements.namedItem("password") as HTMLInputElement).value

    try {
        const response = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        })

        if (!response.ok) throw new Error("Login failed")
        const data = await response.json()
        console.log("✅ Login success", data)

    } catch (err) {
        console.error("❌ Login error", err)
        alert("Login failed")
    }

*/

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
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            name="password"
                                            type={passwordVisible ? "text" : "password"}
                                            placeholder={passwordVisible ? "••••••••" : "••••••••"}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                            onClick={() => setPasswordVisible(!passwordVisible)}
                                        >
                                            {passwordVisible ? (
                                                <svg
                                                    xmlns=""
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="lucide lucide-eye-off"
                                                >
                                                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                                                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                                                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                                                    <line x1="2" x2="22" y1="2" y2="22"></line>
                                                </svg>
                                            ) : (
                                                <svg
                                                    xmlns=""
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="lucide lucide-eye"
                                                >
                                                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                                                    <circle cx="12" cy="12" r="3"></circle>
                                                </svg>
                                            )}
                                        </button>
                                    </div>
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
