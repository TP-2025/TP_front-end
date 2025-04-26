import { Routes, Route } from "react-router-dom"
import { LoginForm } from "@/components/login"
import Layout from "@/pages/Home"

import DoctorsMainContent from "@/pages/Doctors/DosctorsMainContent"
import ModeratorsMainContent from "@/pages/Moderators/ModeratorMainContent"
import AdminsMainContent from "@/pages/Admins/AdminsMainContent"
import PatientsMainContent from "@/pages/Patients/PatientsMainContent"
import DomovPage from "@/pages/otherSidebarStuff/Domov.tsx";
import AddPhotoPage from "@/pages/AddPhotoPage/AddPhoto.tsx";
import AnalyzePhotosMainContent from "@/pages/AnalyzePhotos/AnalyzePhotosMainContent.tsx";

import { RoleProtectedRoute } from "@/Security/RoleRoute"
import { useAuth } from "@/Security/authContext"

function App() {
    const { loading } = useAuth()

    if (loading) return <div className="p-10 text-lg">Loading...</div>

    return (
        <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/" element={<Layout />}>


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
                    path="Domov"
                    element={
                        <RoleProtectedRoute allowedRoles={["admin", "moderator", "doktor", "pacient"]}>
                            <DomovPage />
                        </RoleProtectedRoute>
                    }
                />
                <Route
                    path="AddPhoto"
                    element={
                        <RoleProtectedRoute allowedRoles={["admin", "moderator", "doktor"]}>
                            <AddPhotoPage />
                        </RoleProtectedRoute>
                    }
                />
                <Route
                    path="Analyze"
                    element={
                        <RoleProtectedRoute allowedRoles={["admin", "moderator", "doktor"]}>
                            <AnalyzePhotosMainContent />
                        </RoleProtectedRoute>
                    }
                />
            </Route>
        </Routes>
    )
}

export default App
