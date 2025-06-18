import api from "./axios"

export interface CameraItem {
    id: number
    name: string
    type: string
}

///////////////////////////// Kamera
export const addCamera = async (name: string, type: string): Promise<void> => {
    await api.post("/user/addDevice", { name, type })
}

export const getCameras = async (): Promise<CameraItem[]> => {
    const response = await api.get("/user/getDevices")
    return response.data.devices
}

export const deleteCamera = async (id: number): Promise<void> => {
    await api.delete(`/user/deleteDevice`, {params: { device_id: id }
    })
}

///////////////////////////// diagnoza
export interface DiagnosisItem {
    id: number
    name: string
}

export const addDiagnosis = async (name: string): Promise<void> => {
    await api.post("/user/addDiagnosis", { name })
}

export const getDiagnoses = async (): Promise<DiagnosisItem[]> => {
    const response = await api.get("/user/getDiagnoses")
    console.log("📋 Diagnoses received:", response.data)
    return response.data.diagnoses
}

export const deleteDiagnosis = async (id: number): Promise<void> => {
    await api.delete("/user/deleteDiagnosis", {params: { diagnose_id: id }
    })
}
/////////////////////////////








export const addAccessory = async (name: string): Promise<void> => {
    await api.post("/user/addAccessory", { name })
}

export const addAnalysis = async (name: string): Promise<void> => {
    await api.post("/user/addAnalysis", { name })
}

export const changePassword = async (data: {
    email: string
    old_password: string
    new_password: string
}): Promise<void> => {
    console.log("Sending password change request:", data)
    await api.post("/changePassword", data)
}