import { Routes, Route } from "react-router-dom"
import { LoginForm } from "@/components/login"
import Layout from "@/pages/Home"
import Dashboard from "@/pages/Dashboard/Dashboard"
import DoctorsMainContent from "@/pages/Doctors/DosctorsMainContent"
import ModeratorsMainContent from "@/pages/Moderators/ModeratorMainContent"
import AdminsMainContent from "@/pages/Admins/AdminsMainContent"
import PatientsMainContent from "@/pages/Patients/PatientsMainContent"
import InfoPage from "@/pages/otherSidebarStuff/Info.tsx";
import { RoleProtectedRoute } from "@/Security/RoleRoute"
import { useAuth } from "@/Security/authContext"

function App() {
    const { loading } = useAuth()

    if (loading) return <div className="p-10 text-lg">Loading...</div>

    return (
        <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/" element={<Layout />}>
                <Route path="dashboard" element={<Dashboard />} />

                <Route
                    path="doctors"
                    element={
                        <RoleProtectedRoute allowedRoles={["admin"]}>
                            <DoctorsMainContent />
                        </RoleProtectedRoute>
                    }
                />
                <Route
                    path="moderators"
                    element={
                        <RoleProtectedRoute allowedRoles={["admin", "doktor"]}>
                            <ModeratorsMainContent />
                        </RoleProtectedRoute>
                    }
                />
                <Route
                    path="admins"
                    element={
                        <RoleProtectedRoute allowedRoles={["admin"]}>
                            <AdminsMainContent />
                        </RoleProtectedRoute>
                    }
                />
                <Route
                    path="patients"
                    element={
                        <RoleProtectedRoute allowedRoles={["admin", "moderator", "doktor"]}>
                            <PatientsMainContent />
                        </RoleProtectedRoute>
                    }
                />
                <Route
                    path="info"
                    element={
                        <RoleProtectedRoute allowedRoles={["admin", "moderator", "doktor", "pacient"]}>
                            <InfoPage />
                        </RoleProtectedRoute>
                    }
                />
            </Route>
        </Routes>
    )
}

export default App
