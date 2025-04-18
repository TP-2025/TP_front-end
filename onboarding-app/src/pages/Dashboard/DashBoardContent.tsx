import { useAuth } from "@/Security/authContext"
import AdminsMainContent from "@/pages/Admins/AdminsMainContent"
import PatientsMainContent from "@/pages/Patients/PatientsMainContent"

export default function DashboardContent() {
    const { role } = useAuth()

    if (role === "admin") return <AdminsMainContent />
    if (role === "doktor") return <PatientsMainContent />
    if (role === "moderator") return <div className="p-6">Welcome Moderator 🛡️</div>
    if (role === "pacient") return <div className="p-6">Welcome Patient 👁️</div>

    return <div className="p-6 text-red-600">Unauthorized — unknown role</div>
}
