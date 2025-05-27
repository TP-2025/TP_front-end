import api from "./axios"

export interface Admin {
    name: string
    surname: string
    email: string
    id: number
}


export const getAdmins = async (): Promise<Admin[]> => {
    const res = await api.get<{ admins: Admin[] }>("/admin/getAdmins")
    return res.data.admins
}

export const addAdmin = async (admin: Omit<Admin, "id">): Promise<void> => {
    await api.post("/admin/addAdmin", admin)
}

export const deleteAdmin = async (id: number): Promise<void> => {
    await api.delete("/admin/deleteAdmin", { data: { id } })
}

