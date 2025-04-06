// src/App.tsx

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
