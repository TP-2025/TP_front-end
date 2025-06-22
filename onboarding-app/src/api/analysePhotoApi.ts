import api from "./axios"

export interface OriginalPicture {
    id: number
    path: string
    patient_id: number
    quality?: string
    eye?: string
    technic_notes?: string
    diagnosis_notes?: string
    device_id?: number
    additional_device_id?: number
    date?: string
    technic_id?: number
}

export const getOriginalPictures = async (): Promise<OriginalPicture[]> => {
    const response = await api.get("/image/getOriginalPictures")
    console.log("📷 Loaded original pictures from backend:", response.data)
    return response.data.pictures
}
