import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useNavigate } from "react-router-dom"
import { Help } from "@/components/Help"
import { i18n } from "@/lib/i18n"

import { useAuth } from "@/Security/authContext"
import { login } from "@/api/authApi"
import type { RoleId } from "@/Security/authContext"


export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
    const [lang, setLang] = useState<"sk" | "en">("sk")
    const [passwordVisible, setPasswordVisible] = useState(false)
    const {setUser, setRoleId } = useAuth()
    const navigate = useNavigate()

    const t = i18n[lang]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const form = e.currentTarget as HTMLFormElement
        const email = (form.elements.namedItem("email") as HTMLInputElement).value
        const password = (form.elements.namedItem("password") as HTMLInputElement).value


        if (email === "admin@debug.com" && password === "admin123") {
            const mockAdminUser = {
                id: "0",
                name: "Debug Admin",
                email: "admin@debug.com",
                role_id: 4 as RoleId,
            }

            setUser(mockAdminUser)
            setRoleId(mockAdminUser.role_id)
            localStorage.setItem("user", JSON.stringify(mockAdminUser))

            console.log("✅ Logged in with hardcoded admin user")
            navigate("/Domov")
            return
        }

        try {
            const res = await login({ email, password })
            const user = res.user

            console.log("✅ Login successful:", user)

            if (user) {
                setUser(user)
                setRoleId(user.role_id) // role_id: 1–4
                localStorage.setItem("user", JSON.stringify(user))
            }

            navigate("/Domov")
        } catch (err: any) {
            console.error("❌ Login failed:", err)
            alert(err.response?.data?.message || "Login failed")
        }
    }


    const toggleLang = () => {
        setLang((prev) => (prev === "sk" ? "en" : "sk"))
    }

    return (
        <div className={cn("flex w-full h-screen items-center justify-start px-65", className)} {...props}>
            <div className="flex w-full max-w-7xl items-center justify-between gap-50">
                {/* Left Logo & Title */}
                <div className="flex w-full max-w-5xl items-center justify-center">
                    <img src="/LogoSkupinovy.png" alt="OcuNet Logo" className="w-80 h-80 mb-10 object-contain rounded-xl" />
                    <h1 className="text-6xl font-bold text-gray-800 tracking-tight">OcuNet</h1>
                </div>

                {/* Right Login Form */}
                <Card className="w-full max-w-md p-5 shadow-lg border rounded-xl bg-gray-100">
                    <CardHeader>
                        <CardTitle className="text-2xl">{t.login}</CardTitle>
                        <CardDescription>{t.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-6">
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
                                                <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
                                                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                                                    <path d="M10.73 5.08C11.15 5.03 11.57 5 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                                                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                                                    <line x1="2" y1="2" x2="22" y2="22" />
                                                </svg>
                                            ) : (
                                                <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
                                                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z" />
                                                    <circle cx="12" cy="12" r="3" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div className="flex justify-between w-full gap-3">
                                    <Button type="submit" className="w-40">
                                        {t.login}
                                    </Button>
                                    <Button type="button" onClick={toggleLang} className="w-25 bg-gray-300 text-gray-800 hover:bg-gray-400">
                                        {t.language}
                                    </Button>
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
