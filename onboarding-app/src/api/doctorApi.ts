import api from "./axios"

export interface Doctor {
    name: string
    surname: string
    email: string
    id: number
}

export const getDoctors = async (): Promise<Doctor[]> => {
    const res = await api.get<{ doctors: Doctor[] }>("/admin/getDoctors")
    return res.data.doctors
}

export const getAllDoctors = async (): Promise<Doctor[]> => {
    const res = await api.get<{ users: Doctor[] }>("/user/getUsers")
    console.log("📦 Raw doctors API response:", res.data)
    return res.data.users // not res.data.doctors!
}



export const addDoctor = async (doctor: Omit<Doctor, "id">): Promise<void> => {
    await api.post("/admin/addDoctor", doctor)
}

export const deleteDoctor = async (id: number): Promise<void> => {
    await api.delete("/admin/deleteUser", {
        data: { id },
    })
}
