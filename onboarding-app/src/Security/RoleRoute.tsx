// src/Security/RoleRoute.tsx
import { ReactNode, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/Security/authContext"

type Role = "admin" | "moderator" | "doktor" | "pacient"

interface Props {
    allowedRoles: Role[]
    children: ReactNode
}

export function RoleProtectedRoute({ allowedRoles, children }: Props) {
    const { role, loading } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (!loading && !role) {
            navigate("/")
        }
    }, [loading, role, navigate])

    if (loading) return <div className="p-6">Loading...</div>
    if (!role || !allowedRoles.includes(role)) return null

    return <>{children}</>
}
