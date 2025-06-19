import api from './axios';
import { LoginPayload, LoginResponse } from './types';


export const login = async (credentials: LoginPayload): Promise<LoginResponse> => {
    const res = await api.post<LoginResponse>('/login', credentials);
    return res.data;
};

export const sendPasswordResetEmail = async (email: string): Promise<void> => {
    await api.post("/forgotPassword", { email })
}