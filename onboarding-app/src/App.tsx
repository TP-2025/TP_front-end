import { Routes, Route } from "react-router-dom"
import { LoginForm } from "@/components/login"
import Layout from "@/pages/Home"

import DoctorsMainContent from "@/pages/Doctors/DosctorsMainContent"
import ModeratorsMainContent from "@/pages/Moderators/ModeratorMainContent"
import AdminsMainContent from "@/pages/Admins/AdminsMainContent"
import PatientsMainContent from "@/pages/Patients/PatientsMainContent"
import DomovPage from "@/pages/otherSidebarStuff/Domov"
import AddPhotoPage from "@/pages/AddPhotoPage/AddPhoto"
import AnalyzePhotosMainContent from "@/pages/AnalyzePhotos/AnalyzePhotosMainContent"

import { RoleProtectedRoute } from "@/Security/RoleRoute"
import { useAuth } from "@/Security/authContext"

function App() {
    const { loading } = useAuth()

    if (loading) return <div className="p-10 text-lg">Loading...</div>

    return (
        <Routes>
            {/* Login Route */}
            <Route path="/" element={<LoginForm />} />

            {/* Authenticated Layout Route */}
            <Route element={<Layout />}>
                <Route
                    path="doctors"
                    element={
                        <RoleProtectedRoute allowedRoleIds={[4]}>
                            <DoctorsMainContent />
                        </RoleProtectedRoute>
                    }
                />
                <Route
                    path="moderators"
                    element={
                        <RoleProtectedRoute allowedRoleIds={[4, 3]}>
                            <ModeratorsMainContent />
                        </RoleProtectedRoute>
                    }
                />
                <Route
                    path="admins"
                    element={
                        <RoleProtectedRoute allowedRoleIds={[4]}>
                            <AdminsMainContent />
                        </RoleProtectedRoute>
                    }
                />
                <Route
                    path="patients"
                    element={
                        <RoleProtectedRoute allowedRoleIds={[4, 3, 2]}>
                            <PatientsMainContent />
                        </RoleProtectedRoute>
                    }
                />
                <Route
                    path="Domov"
                    element={
                        <RoleProtectedRoute allowedRoleIds={[4, 3, 2, 1]}>
                            <DomovPage />
                        </RoleProtectedRoute>
                    }
                />
                <Route
                    path="AddPhoto"
                    element={
                        <RoleProtectedRoute allowedRoleIds={[4, 3, 2]}>
                            <AddPhotoPage />
                        </RoleProtectedRoute>
                    }
                />
                <Route
                    path="Analyze"
                    element={
                        <RoleProtectedRoute allowedRoleIds={[4, 3, 2]}>
                            <AnalyzePhotosMainContent />
                        </RoleProtectedRoute>
                    }
                />
            </Route>
        </Routes>
    )
}

export default App
