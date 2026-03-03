import { restClient, ApiResponse } from './rest-client';
import { setToken, setUser, getToken, removeToken, removeUser } from './storage';

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
  };
}

export interface RegisterResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
}

export interface SendCodeResponse {
  success: boolean;
  message: string;
}

export const authApi = {
  async loginWithEmail(
    email: string,
    password: string
  ): Promise<ApiResponse<LoginResponse>> {
    const result = await restClient.post<LoginResponse>('/auth/login-with-email', {
      email,
      password,
    });

    if (result.data) {
      setToken(result.data.token);
      setUser(JSON.stringify(result.data.user));
    }

    return result;
  },

  async loginWithCode(
    phone: string,
    code: string
  ): Promise<ApiResponse<LoginResponse>> {
    const result = await restClient.post<LoginResponse>('/auth/login-with-code', {
      phone,
      code,
    });

    if (result.data) {
      setToken(result.data.token);
      setUser(JSON.stringify(result.data.user));
    }

    return result;
  },

  async sendCode(phone: string): Promise<ApiResponse<SendCodeResponse>> {
    return restClient.post<SendCodeResponse>('/auth/send-code', { phone });
  },

  async register(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    role?: string;
  }): Promise<ApiResponse<RegisterResponse>> {
    const result = await restClient.post<RegisterResponse>('/auth/register', data);
    return result;
  },

  logout(): void {
    if (typeof window !== 'undefined') {
      removeToken();
      removeUser();
    }
  },

  isAuthenticated(): boolean {
    return !!getToken();
  },
};
