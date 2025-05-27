Stačí len skopírovať : Domov.tsx

```javascript
export default function DomovPage() {
    return (
        <div className="p-10 max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-gray-800">
                Vitajte v systéme OcuNet 🕵️👁️
            </h1>

            <p className="text-gray-700 text-lg mb-3 leading-relaxed">
                Nachádzate sa na úvodnej stránke systému OcuNet. Tu nájdete stručný popis, ktorý Vám pomôže s orientáciou v aplikácií
                Nižšie sú uvedené časti a funkcie, ktoré môžete v systéme nájsť a používať.
            </p>

            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Aplikácie</h2>
            <ul className="list-none mb-8">
                {/* Položka Fotky */}
                <li className="mb-6"> {/* Väčší spodný okraj pre celú položku */}
                    <ul className="list-none mb-2">
                        {/* Položka Fotky */}
                        <li className="mb-6"> {/* Väčší spodný okraj pre celú položku */}
                            <h4 className="text-xl font-medium text-gray-800 mb-1">Fotky</h4>
                            <ul className="list-disc list-inside text-gray-600 text-base ml-4">
                                <li className="mb-1">
                                    <span className="font-semibold">Priestor na nahratie fotky oka:</span> Tu môžete priamo nahrať digitálne snímky oka.
                                </li>
                                <li className="mb-1">
                                    <span className="font-semibold">Výber informácií o fotke:</span>
                                    {/* Tu je vnorený zoznam pre tri body, ktoré boli na obrázku */}
                                    <ul className="list-disc list-inside text-gray-600 text-base ml-4 mt-1"> {/* list-disc pre bodky ako na obrázku */}
                                        <li className="mb-1">Výber konkrétneho pacienta z databázy.</li>
                                        <li className="mb-1">Určenie oka (pravé alebo ľavé).</li>
                                        <li>Priestor na prípadné poznámky k fotke.</li>
                                    </ul>
                                </li>
                                <li className="mb-1">
                                    <span className="font-semibold">Tlačidlo na uloženie/reset:</span> Uložte informácie do systému alebo resetujte formulár.
                                </li>
                            </ul>
                        </li>

                        {/* Položka Analýza */}
                        <li className="mb-4">
                            <h4 className="text-xl font-medium text-gray-800 mb-2">Analýza</h4>
                            <ul className="list-disc list-inside text-gray-600 text-base ml-4">
                                <li className="mb-1">
                                    <span className="font-semibold">Výber pacienta:</span> Tu môžete vybrať pacienta z databázy. Zobrazia sa inormácie o pacientovy a k nemu priradené fotografie.
                                </li>
                                <li className="mb-1">
                                    <span className="font-semibold">Galéria fotografií a výber fotky:</span> Sú tu zobrazené fotografie. Fotografie je možné zoradiť alebo filtrovať. Následne je možné zvoliť fotgrafiu na analýzu.
                                </li>
                                <li className="mb-1">
                                    <span className="font-semibold">Výber metódy analýzy</span> Tu je možné vybrať akým spôsobom sa bude fotografia anlyzovať. Tlačidlo na odoslanie fotografie/í na zvolenú analýzu.
                                </li>
                            </ul>
                        </li>
                    </ul>
                </li>
            </ul>

            {/* Nadpis pre kategóriu Používatelia */}
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Používatelia</h2>
            <ul className="list-none mb-4">
                {/* Položka Admini */}
                <li className="mb-6">
                    <h4 className="text-xl font-medium text-gray-800 mb-1">Admini</h4>
                    <ul className="list-disc list-inside text-gray-600 text-base ml-4">
                        <p className="text-gray-600 text-base mt-1">
                            Admini majú prístup ku vštkým dátam bez výnimky
                        </p>
                        <li className="mb-1">
                            <span className="font-semibold">Možnosť vyhľadania:</span> vyhľadanie konkrétneho admina
                        </li>
                        <li className="mb-1">
                            <span className="font-semibold">Pridaj Admina:</span> tlačidlom je možné zaregistrovať nového člena admin tímu.
                        </li>
                        <li>
                            <span className="font-semibold">Zoznam adminov:</span> Zoznam obsahuje údaje o všetkých adminoch.
                        </li>
                    </ul>
                </li>

                {/* Položka Doktori */}
                <li className="mb-6">
                    <h4 className="text-xl font-medium text-gray-800 mb-1">Doktori</h4>
                    <ul className="list-disc list-inside text-gray-600 text-base ml-4">
                        <p className="text-gray-600 text-base mt-1">
                            Doktory posudzujú diagnózy pacientov. Každý doktor má svojich pacientov
                        </p>
                        <li className="mb-1">
                            <span className="font-semibold">Možnosť vyhľadania:</span> vyhľadanie konkrétneho doktora
                        </li>
                        <li className="mb-1">
                            <span className="font-semibold">Pridaj Doktora:</span> tlačidlom je možné zaregistrovať nového doktora.
                        </li>
                        <li>
                            <span className="font-semibold">Zoznam doktorov:</span> Zoznam obsahuje údaje o všetkých lekároch ako napríkad počet pacientov.
                        </li>
                    </ul>
                </li>

                {/* Položka Technici */}
                <li className="mb-6">
                    <h4 className="text-xl font-medium text-gray-800 mb-2">Technici</h4>
                    <ul className="list-disc list-inside text-gray-600 text-base ml-4">
                        <p className="text-gray-600 text-base mt-1">
                            Technici sa starajú o nahrávanie fotografií očí pacientov.
                        </p>
                        <li className="mb-1">
                            <span className="font-semibold">Možnosť vyhľadania:</span> vyhľadanie konkrétneho technika
                        </li>
                        <li className="mb-1">
                            <span className="font-semibold">Pridaj Technika:</span> tlačidlom je možné zaregistrovať nového technika.
                        </li>
                        <li>
                            <span className="font-semibold">Zoznam adminov:</span> Zoznam obsahuje údaje o všetkých technikov. Zobrazená je aj informácia o aktivite technikov.
                        </li>
                    </ul>
                </li>

                {/* Položka Pacienti */}
                <li className="mb-6">
                    <h4 className="text-xl font-medium text-gray-800 mb-2">Pacienti</h4>
                    <ul className="list-disc list-inside text-gray-600 text-base ml-4">
                        <p className="text-gray-600 text-base mt-1">
                            Pacient má pridelené svoje fotografie v systéme. Tie sú posudzované analýzami, ale aj doktorom.
                        </p>
                        <li className="mb-1">
                            <span className="font-semibold">Možnosť vyhľadania:</span> vyhľadanie konkrétneho pacienta
                        </li>
                        <li className="mb-1">
                            <span className="font-semibold">Pridaj Pacienta:</span> tlačidlom je možné zaregistrovať nového pacienta.
                        </li>
                        <li>
                            <span className="font-semibold">Zoznam pacientov:</span> Zoznam obsahuje údaje o všetkých pacientoch. Zobrazená je aj informácia o počte fotografií, ktoré má daný pacient nahraté v systéme.
                        </li>
                    </ul>
                </li>
            </ul>

            {/* Nadpis pre kategóriu Systém */}
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Systém</h2>
            <ul className="list-none mb-8">
                {/* Položka Nastavenia */}
                <li className="mb-6">
                    <h4 className="text-xl font-medium text-gray-800 mb-2">Nastavenia (Optional)</h4>
                    <ul className="list-disc list-inside text-gray-600 text-base ml-4">
                        <p className="text-gray-600 text-base mt-8">
                            V prípade problémov s niektorými komponentami kontaktujte admin tím.
                        </p>
                        <li className="mb-1">
                            <span className="font-semibold">-</span>
                        </li>
                        <li className="mb-1">
                            <span className="font-semibold">-</span>
                        </li>
                        <li>
                            <span className="font-semibold">-</span>
                        </li>
                    </ul>
                </li>
            </ul>

            <p className="text-gray-600 text-base mt-8">
                V prípade problémov s niektorými komponentami kontaktujte admin tím.
            </p>
        </div>
    )
}
```
Zabudli ste heslo
```javascript
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { i18n } from "@/lib/i18n"

interface ForgotPasswordModalProps {
    lang: "sk" | "en"
    onClose: () => void
}

export const ForgotPasswordModal = ({ lang, onClose }: ForgotPasswordModalProps) => {
    const [email, setEmail] = useState("")
    const [isSending, setIsSending] = useState(false)
    const t = i18n[lang]

    const handleSend = async () => {
        setIsSending(true)
        try {
            // Sem vlož logiku pre odoslanie žiadosti (napr. API call)
            console.log("📨 Sending reset link to:", email)
            // await fetch("/api/reset-password", { ... })

            // Po úspešnom odoslaní zatvor modal
            onClose()
        } catch (error) {
            console.error("❌ Error sending reset link:", error)
            // Tu môžeš zobraziť alert alebo chybové hlásenie
        } finally {
            setIsSending(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">{t.forgotPassword}</h2>
                <p className="mb-4">{t.enterEmailForReset}</p>
                <Input
                    type="email"
                    placeholder="m@example.com"
                    className="mb-4"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <div className="flex justify-end gap-3">
                    <Button onClick={onClose} variant="ghost">
                        {t.cancel}
                    </Button>
                    <Button onClick={handleSend} disabled={isSending}>
                        {isSending ? "..." : t.sendResetLink}
                    </Button>
                </div>
            </div>
        </div>
    )
}

```
upravený login
```javascript
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

import { useAuth } from "@/Security/authContext"
import type { Role } from "@/Security/authContext"

import { ForgotPasswordModal } from "@/components/ForgotPasswordModal"


export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
    const [lang, setLang] = useState<"sk" | "en">("sk")
    const [role, setRole] = useState(i18n[lang].chooseRole)
    const { setRole: setAuthRole } = useAuth()
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false)
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

        if (password === "admin") {
            setAuthRole("admin")
            localStorage.setItem("role", "admin")
        } else {
            setAuthRole(role as Role)
            localStorage.setItem("role", role)
        }

        navigate("/Domov")
    }

    const toggleLang = () => {
        const newLang = lang === "sk" ? "en" : "sk"
        setLang(newLang)
        setRole(i18n[newLang].chooseRole)
    }

    return (
        <div className={cn("flex w-full h-screen items-center justify-start px-65", className)} {...props}>
            <div className="flex w-full max-w-7xl items-center justify-between gap-50">
                <div className="flex w-full max-w-5xl items-center justify-center">
                    <img src="/LogoSkupinovy.png"
                         alt="OcuNet Logo"
                         className="w-80 h-80 mb-10 object-contain rounded-xl" />
                    <h1 className="text-6xl font-bold text-gray-800 tracking-tight">OcuNet</h1>
                </div>

                <Card className="w-full max-w-md p-5 shadow-lg border rounded-xl bg-gray-100">
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
                                        <button
                                            type="button"
                                            onClick={() => setShowForgotPasswordModal(true)}
                                            className="ml-auto text-sm text-blue-600 underline hover:no-underline"
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
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                            onClick={() => setPasswordVisible(!passwordVisible)}
                                        >
                                            {passwordVisible ? (
                                                <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" /></svg>
                                            ) : (
                                                <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div className="flex justify-between w-full gap-3">
                                    <Button type="submit" className="w-40">{t.login}</Button>
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
            {showForgotPasswordModal && (
                <ForgotPasswordModal lang={lang} onClose={() => setShowForgotPasswordModal(false)} />
            )}
        </div>
    )
}
```
Jazyk
```javascript
// i18n.ts (umiestni do src/utils alebo src/lib)

export const i18n = {
    en: {
        login: "Login",
        description: "Enter your email below to login to your account",
        role: "Role",
        email: "E-mail",
        password: "Password",
        forgotPassword: "Forgot your password?",
        language: "Language",
        help: "Help",
        chooseRole: "Choose role",
        loginSuccess: "✅ Form submitted successfully! Check the console.",
        selectRoleAlert: "❗ Please select a role before logging in.",
        enterEmailForReset: "Enter your email address to receive a reset link.",
        cancel: "Cancel",
        sendResetLink: "Send reset link",
        helpTitle: "Help",
        Help: {
            role: "Role: Choose your role (Patient, Moderator).",
            email: "Email: Enter your registered email (ID).",
            emailNote: "Your ID was sent to your email by your doctor.",
            password: "Password: Enter your password.",
            passwordNote: "Your password was auto-generated and sent to your email. If lost, click 'Forgot your password?'",
            login: "Login: Click to log in.",
        },
    },
    sk: {
        login: "Prihlásenie",
        description: "Zadajte svoj e-mail na prihlásenie do účtu",
        role: "Rola",
        email: "E-mail",
        password: "Heslo",
        forgotPassword: "Zabudli ste heslo?",
        language: "Jazyk",
        help: "Pomoc",
        chooseRole: "Vyber rolu",
        loginSuccess: "✅ Úspešne odoslané! Skontrolujte konzolu.",
        selectRoleAlert: "❗ Pred prihlásením vyberte rolu.",
        enterEmailForReset: "Zadajte svoj e-mail pre zaslanie odkazu na obnovenie hesla.",
        cancel: "Zrušiť",
        sendResetLink: "Odoslať odkaz",
        helpTitle: "Pomoc",
        Help: {
            role: "Rola: Vyber svoju rolu (Pacient, Moderátor).",
            email: "E-mail: Zadaj svoj registrovaný e-mail (ID).",
            emailNote: "ID Vám bolo zaslané Vašim lekárom na e-mail.",
            password: "Heslo: Zadaj svoje heslo.",
            passwordNote: "Heslo bolo automaticky vygenerované a zaslané na e-mail. Ak ste ho stratili, kliknite na 'Zabudli ste heslo?'",
            login: "Prihlásenie: Kliknutím sa prihlásite.",
        },
    },
}
```
