// src/Security/RoleRoute.tsx
import { ReactNode, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/Security/authContext"

type Props = {
    allowedRoleIds: number[] // e.g. [4] for admin, [3, 4] for doktor and admin
    children: ReactNode
}

export function RoleProtectedRoute({ allowedRoleIds, children }: Props) {
    const { roleId, loading } = useAuth()  // ✅ FIXED: use roleId here
    const navigate = useNavigate()

    useEffect(() => {
        if (!loading && roleId === null) {
            navigate("/")
        }
    }, [loading, roleId, navigate])

    if (loading) return <div className="p-6">Načítava sa...</div>
    if (roleId === null || !allowedRoleIds.includes(roleId)) return null

    return <>{children}</>
}
