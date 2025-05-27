import api from './axios';
import { LoginPayload, LoginResponse } from './types';

/**
 * Sends login request to backend.
 * @param credentials The email and password typed by user.
 * @returns Backend response with user info or error.
 */
export const login = async (credentials: LoginPayload): Promise<LoginResponse> => {
    const res = await api.post<LoginResponse>('/login', credentials);
    return res.data;
};
