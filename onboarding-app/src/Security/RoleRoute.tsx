import { ReactNode, useEffect, useState } from "react"
import { useAuth } from "@/Security/authContext"


type Role = "admin" | "moderator" | "doktor" | "pacient"

interface RoleProtectedRouteProps {
    allowedRoles: Role[]
    children: ReactNode
}

export function RoleProtectedRoute({ allowedRoles, children }: RoleProtectedRouteProps) {
    const { role } = useAuth()
    const [show, setShow] = useState(false)


    useEffect(() => {
        if (!role) {
            // If no role, go to login
            window.location.href = "/"
        } else if (allowedRoles.includes(role)) {
            setShow(true)
        } else {
            // Role exists but not allowed – stay on current route, show nothing
            setShow(false)
        }
    }, [role, allowedRoles])

    if (!role) return null
    if (!show) return null

    return <>{children}</>
}
