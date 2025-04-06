import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useNavigate } from "react-router-dom"

import { DropdownRole } from "@/components/loginRole" // dropdown menu for roles


export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
    const [role, setRole] = useState("choose role")
    const navigate = useNavigate()
    const handleSubmit = async (e: React.FormEvent) => {
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
        e.preventDefault()

        const form = e.currentTarget as HTMLFormElement
        const email = (form.elements.namedItem("email") as HTMLInputElement).value
        const password = (form.elements.namedItem("password") as HTMLInputElement).value

        if (role === "choose role") {
            alert("❗ Please select a role before logging in.")
            return
        }

        console.log("📦 Submitted values:", {
            email,
            password,
            role,
        })

        alert("✅ Logged in lets goooooooo mf!")

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


    return (
        <div className={cn("flex flex-col w-200 items-center", className)} {...props}>
            <Card className="w-full max-w-md p-5 shadow-lg border rounded-xl bg-white">
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>Enter your email below to login to your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="role">Role</Label>
                                <DropdownRole role={role} setRole={setRole} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <a href="#" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                                        Forgot your password?
                                    </a>
                                </div>
                                <Input id="password" name="password" type="password" required />
                            </div>
                            <div className="flex justify-between w-full">
                                <Button type="submit" className="w-40">
                                    Login
                                </Button>
                                <Button type="button" className="w-15 bg-gray-300 text-gray-800 hover:bg-gray-400">
                                    Help
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

