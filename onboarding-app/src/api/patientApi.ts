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
        id: p.id,
        name: p.name,
        surname: p.surname,
        email: p.email,
        doctor_id: p.medic_id ?? 0,
        birth_date: String(p.year_of_birth),
        sex: p.sex,
    }))

}

export const getMyPatients = async (): Promise<Patient[]> => {
    const res = await api.get<{ patients: any[] }>("/user/getPatients")
    console.log("📦 Raw patients response:", res.data)

    return res.data.patients.map((p) => ({
        id: p.id,
        name: p.name,
        surname: p.surname,
        email: p.email,
        doctor_id: p.medic_id ?? 0,
        birth_date: String(p.year_of_birth),
        sex: p.sex,
    }))
}

export const removePatient = async (id: number): Promise<void> => {
    await api.delete("/user/deletePatient", { data: { id } })
}

export const deletePatient = async (id: number): Promise<void> => {
    await api.delete("/admin/deletePatient", { data: { id } })
}

