// types.ts

// Role ID mapping: 1 = Pacient, 2 = Moderator, 3 = Doktor, 4 = Admin
export type RoleId = 1 | 2 | 3 | 4

export interface User {
    id: string
    email: string
    name?: string
    role?: string
    role_id: RoleId
}

export interface LoginPayload {
    email: string
    password: string
}

export interface LoginResponse {
    message: string
    user?: User
}
