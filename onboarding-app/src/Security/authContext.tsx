// src/Security/authContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export type Role = "admin" | "moderator" | "doktor" | "pacient" | null


const AuthContext = createContext<{
    role: Role
    setRole: (r: Role) => void
    loading: boolean
}>({
    role: null,
    setRole: () => {},
    loading: true,
})

type AuthProviderProps = {
    children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [role, setRole] = useState<Role>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const storedRole = localStorage.getItem("role") as Role | null
        if (storedRole) setRole(storedRole)
        setLoading(false)
    }, [])

    return (
        <AuthContext.Provider value={{ role, setRole, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
