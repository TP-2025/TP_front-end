// src/Security/authContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react"

// 1 = pacient, 2 = technik, 3 = doktor, 4 = admin
export type RoleId = 1 | 2 | 3 | 4 | null

export interface User {
    id: string
    email: string
    name?: string
    role?: string
    role_id: RoleId
}

interface AuthContextType {
    user: User | null
    setUser: (user: User | null) => void
    roleId: RoleId
    setRoleId: (roleId: RoleId) => void
    loading: boolean
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => {},
    roleId: null,
    setRoleId: () => {},
    loading: true,
})

type AuthProviderProps = {
    children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null)
    const [roleId, setRoleId] = useState<RoleId>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
            const parsedUser: User = JSON.parse(storedUser)
            setUser(parsedUser)
            setRoleId(parsedUser.role_id)
        }

        setLoading(false)
    }, [])

    return (
        <AuthContext.Provider value={{ user, setUser, roleId, setRoleId, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)