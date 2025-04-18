// src/pages/otherSidebarStuff/Logout.tsx
import { useAuth } from "@/Security/authContext"
import { useNavigate } from "react-router-dom"

export function useLogout() {
    const { setRole } = useAuth()
    const navigate = useNavigate()

    const logout = () => {
        localStorage.removeItem("role")
        setRole(null)
        navigate("/")
    }

    return logout
}
