import api from "./axios"

export const uploadPhotoWithMetadata = async (
    file: File,
    metadata: {
        patient_id: number
        device_id?: number
        additional_equipment_id?: number
        quality?: "Dobra" | "Zla"
        technic_notes?: string
        eye?: "l" | "r"
        date?: string
        technician_id?: number
    }
) => {
    const formData = new FormData()
    formData.append("image", file)

    Object.entries(metadata).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            formData.append(key, String(value))
        }
    })

    console.log("📤 Sending photo upload request with the following data:")
    for (const [key, value] of formData.entries()) {
        console.log(key, ":", value)
    }

    return api.post("/user/addPicture", formData, {
    })
}