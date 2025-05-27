import { useAuth } from "@/Security/authContext"
import { useNavigate } from "react-router-dom"

export function useLogout() {
    const { setUser, setRoleId } = useAuth()
    const navigate = useNavigate()

    const logout = () => {
        localStorage.removeItem("user")
        setUser(null)
        setRoleId(null)
        navigate("/")
    }

    return logout
}
