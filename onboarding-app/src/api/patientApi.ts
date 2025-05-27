import api from "./axios"

export interface Patient {
    id: number
    name: string
    surname: string
    email: string
    doctor_id: number
    birth_date?: string
    sex?: string
}

export const addPatient = async (patient: Omit<Patient, "id">): Promise<void> => {
    await api.post("/user/addPatient", patient)
}

export const getPatients = async (): Promise<Patient[]> => {
    const res = await api.get<{ patients: any[] }>("/admin/getPatients")
    console.log("📦 Raw patients response:", res.data)

    return res.data.patients.map((p) => ({
        id: p.patient_id,
        name: p.name,
        surname: p.surname,
        email: p.email,
        doctor_id: p.medic_id,
        birth_date: p.birth_date,
        sex: p.sex,
    }))
}

export const getMyPatients = async (): Promise<Patient[]> => {
    const res = await api.get<{ patients: any[] }>("/user/getPatients")
    console.log("📦 Raw patients response:", res.data)

    return res.data.patients.map((p) => ({
        id: p.patient_id,
        name: p.name,
        surname: p.surname,
        email: p.email,
        doctor_id: p.medic_id,
        birth_date: p.birth_date,
        sex: p.sex,
    }))
}

export const removePatient = async (id: number): Promise<void> => {
    console.log("🗑️ Sending delete request for patient:", { id }) // Debug log
    await api.delete("/user/deletePatient", { data: { id } })
}
