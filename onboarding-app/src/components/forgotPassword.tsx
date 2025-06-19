import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { i18n } from "@/lib/i18n"
import { sendPasswordResetEmail } from "@/api/authApi"

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
            await sendPasswordResetEmail(email)
            onClose()
        } catch (error: any) {
            console.error("❌ Error sending reset link:", error)
            alert(error.response?.data?.message || "Failed to send reset link.")
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