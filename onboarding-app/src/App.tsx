// src/App.tsx
/*
import { Routes, Route } from "react-router-dom"
import { LoginForm } from "@/components/login"
import Home from "@/pages/Home"
import Admin from "@/pages/Admin"
import Doktor from "@/pages/Doctor"
import Pacient from "@/pages/Pacient"
import Moderator from "@/pages/Moderator"


function App() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-300 p-4">
            <Routes>
                <Route path="/" element={<LoginForm />} />
                <Route path="/home" element={<Home />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/doktor" element={<Doktor />} />
                <Route path="/pacient" element={<Pacient />} />
                <Route path="/Moderator" element={<Moderator />} />
            </Routes>
        </div>
    )
}

export default App
*/

// src/App.tsx
import { Routes, Route } from "react-router-dom"
import { LoginForm } from "@/components/login"
import Layout from "@/pages/Home" // ✅ renamed from Home.tsx to Layout.tsx
import Admin from "@/pages/Admin"
import Moderator from "@/pages/Moderator"
import Doctor from "@/pages/Doctor"
import Pacient from "@/pages/Pacient"
import DoctorsMainContent from "@/pages/Doctors/DosctorsMainContent"
import ModeratorsMainContent from "@/pages/Moderators/ModeratorMainContent"
import { RoleProtectedRoute } from "@/Security/RoleRoute"

function App() {
    return (
        <Routes>
            {/* Public login page */}
            <Route path="/" element={<LoginForm />} />

            {/* Protected layout routes */}
            <Route path="/" element={<Layout />}>
                <Route
                    path="admin"
                    element={
                        <RoleProtectedRoute allowedRoles={["admin"]}>
                            <Admin />
                        </RoleProtectedRoute>
                    }
                />
                <Route
                    path="moderator"
                    element={
                        <RoleProtectedRoute allowedRoles={["moderator"]}>
                            <Moderator />
                        </RoleProtectedRoute>
                    }
                />
                <Route
                    path="doktor"
                    element={
                        <RoleProtectedRoute allowedRoles={["doktor"]}>
                            <Doctor />
                        </RoleProtectedRoute>
                    }
                />
                <Route
                    path="pacient"
                    element={
                        <RoleProtectedRoute allowedRoles={["pacient"]}>
                            <Pacient />
                        </RoleProtectedRoute>
                    }
                />

                {/* ✅ New doctors page — visible to admin only */}
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
                        <RoleProtectedRoute allowedRoles={["admin"]}>
                            <ModeratorsMainContent />
                        </RoleProtectedRoute>
                    }
                />

            </Route>
        </Routes>
    )
}

export default App
