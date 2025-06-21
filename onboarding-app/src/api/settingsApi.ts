import api from "./axios"



///////////////////////////// Kamera
export interface CameraItem {
    id: number
    name: string
    type: string
}

export const addCamera = async (name: string, type: string): Promise<void> => {
    await api.post("/user/addDevice", { name, type })
}

export const getCameras = async (): Promise<CameraItem[]> => {
    const response = await api.get("/user/getDevices")
    return response.data.devices
}

export const deleteCamera = async (id: number): Promise<void> => {
    await api.delete(`/user/deleteDevice`, {data: { id }
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
    await api.delete("/user/deleteDiagnosis", {data: { id }
    })
}
////////////////////////////

export interface UserPersonalInfo {
    name: string
    surname: string
    date: string | null
    sex: string | null
}

export interface PersonalDataPayload {
    name: string
    surname: string
    sex?: string | null
    birth_date?: string | null
}

export const getUserPersonalInfo = async (): Promise<UserPersonalInfo> => {
    const res = await api.get("/user/getMyInfo")
    return res.data
}

export const sendPersonalData = async (data: PersonalDataPayload): Promise<void> => {
    console.log("📤 Sending personal data:", data)
    await api.post("/changePersonalInfo", data)
}

//////////////////////////// additional devices
export const getAdditionalDevices = async (): Promise<CameraItem[]> => {
    const response = await api.get("user/getAdditionalDevices")
    return response.data.devices
}

export const addAdditionalDevice = async (name: string): Promise<void> => {
    await api.post("/user/addAdditionalDevice", { name })
}

export const deleteAdditionalDevice = async (id: number): Promise<void> => {
    await api.delete("/user/deleteAdditionalDevice", {
        data: { id },
    })
}


////////////////////////////


export interface AnalysisItem {
    id: number
    name: string
}

export const getAnalyses = async (): Promise<AnalysisItem[]> => {
    const response = await api.get("/user/getMethods")
    return response.data.methods
}

export const addAnalysis = async (name: string): Promise<void> => {
    console.log("📤 Sending analysis to backend:", name)
    await api.post("/user/addMethod", { name })
}


export const deleteAnalysis = async (id: number): Promise<void> => {
    await api.delete("/user/deleteMethod", { data: { id } })
}






export const changePassword = async (data: {
    email: string
    old_password: string
    new_password: string
}): Promise<void> => {
    console.log("Sending password change request:", data)
    await api.post("/changePassword", data)
}