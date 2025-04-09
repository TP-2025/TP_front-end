import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export type Role = "admin" | "moderator" | "doktor" | "pacient" | null


const AuthContext = createContext<{
    role: Role
    setRole: (r: Role) => void
}>({
    role: null,
    setRole: () => {},
})

type AuthProviderProps = {
    children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [role, setRole] = useState<Role>(null)

    useEffect(() => {
        const storedRole = localStorage.getItem("role") as Role
        if (storedRole) setRole(storedRole)
    }, [])

    return (
        <AuthContext.Provider value={{ role, setRole }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
