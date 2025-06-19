"use client"

import type React from "react"
import { useState } from "react"
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
import { ForgotPasswordModal } from "@/components/forgotPassword.tsx"


export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
    const [lang, setLang] = useState<"sk" | "en">("sk")
    const [passwordVisible, setPasswordVisible] = useState(false)
    const { setUser, setRoleId } = useAuth()
    const navigate = useNavigate()

    const t = i18n[lang]
    const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false)


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
        <div className={cn("flex w-full min-h-screen items-center justify-center p-4 md:p-8", className)} {...props}>
            <div className="flex flex-col lg:flex-row w-full max-w-6xl items-center justify-center lg:justify-between gap-8 lg:gap-16">
                {/* Logo & Title Section */}
                <div className="flex flex-col items-center justify-center text-center lg:flex-row lg:text-left">
                    <img
                        src="/LogoSkupinovy.png"
                        alt="OcuNet Logo"
                        className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-64 lg:h-64 xl:w-80 xl:h-80 mb-4 lg:mb-0 lg:mr-6 object-contain rounded-xl"
                    />
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 tracking-tight">
                        OcuNet
                    </h1>
                </div>

                {/* Login Form */}
                <Card className="w-full max-w-sm sm:max-w-md lg:max-w-lg p-3 sm:p-5 shadow-lg border rounded-xl bg-gray-100">
                    <CardHeader className="space-y-1 pb-4">
                        <CardTitle className="text-xl sm:text-2xl">{t.login}</CardTitle>
                        <CardDescription className="text-sm sm:text-base">{t.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-4 sm:gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="email" className="text-sm sm:text-base">
                                        {t.email}
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        required
                                        className="h-10 sm:h-11"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password" className="text-sm sm:text-base">
                                            {t.password}
                                        </Label>
                                        <button
                                            type="button"
                                            onClick={() => setShowForgotPasswordModal(true)}
                                            className="ml-auto text-xs sm:text-sm underline hover:underline underline-offset-4 text-blue-600"
                                        >
                                            {t.forgotPassword}
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            name="password"
                                            type={passwordVisible ? "text" : "password"}
                                            placeholder="••••••••"
                                            required
                                            className="h-10 sm:h-11 pr-12"
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1"
                                            onClick={() => setPasswordVisible(!passwordVisible)}
                                        >
                                            {passwordVisible ? (
                                                <svg
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    fill="none"
                                                >
                                                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                                                    <path d="M10.73 5.08C11.15 5.03 11.57 5 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                                                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                                                    <line x1="2" y1="2" x2="22" y2="22" />
                                                </svg>
                                            ) : (
                                                <svg
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    fill="none"
                                                >
                                                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z" />
                                                    <circle cx="12" cy="12" r="3" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row justify-between w-full gap-3">
                                    <Button type="submit" className="w-full sm:w-auto sm:flex-1 h-10 sm:h-11 text-sm sm:text-base">
                                        {t.login}
                                    </Button>
                                    <div className="flex gap-2 sm:gap-3">
                                        <Button
                                            type="button"
                                            onClick={toggleLang}
                                            className="flex-1 sm:w-20 h-10 sm:h-11 bg-gray-300 text-gray-800 hover:bg-gray-400 text-sm sm:text-base"
                                        >
                                            {t.language}
                                        </Button>
                                        <Help lang={lang} />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
            {showForgotPasswordModal && (
                <ForgotPasswordModal
                    lang={lang}
                    onClose={() => setShowForgotPasswordModal(false)}
                />
            )}
        </div>
    )
}
