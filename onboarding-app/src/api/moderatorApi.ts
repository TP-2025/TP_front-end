import api from "./axios"

export interface Moderator {
    name: string
    surname: string
    email: string
    id: number
}


export const getModerators = async (): Promise<Moderator[]> => {
    const res = await api.get<{ technics: Moderator[] }>("/admin/getTechnics")
    console.log("📦 Raw moderator API response:", res.data)
    return res.data.technics
}

export const getMyModerators = async (): Promise<Moderator[]> => {
    const res = await api.get<{ users: Moderator[] }>("/user/getUsers")
    console.log("📦 Raw moderator API response:", res.data)
    return res.data.users
}


export const addModerator = async (moderator: Omit<Moderator, "id">): Promise<void> => {
    await api.post("/admin/addTechnic", moderator)
}

export const addUser = async (moderator: Omit<Moderator, "id">): Promise<void> => {
    await api.post("/user/addTechnic", moderator)
}


export const deleteModerator = async (id: number): Promise<void> => {
    await api.delete("/admin/deleteUser", {data: { id },
    })
}
