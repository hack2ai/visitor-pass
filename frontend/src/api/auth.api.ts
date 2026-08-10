import api from "./axios";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;

  data: {
    user: {
      id: string;
      name: string;
      email: string;
      role: "ADMIN" | "SECURITY" | "EMPLOYEE";
    };

    accessToken: string;
  };
}

export const loginApi = async (
  payload: LoginRequest
): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>(
    "/auth/login",
    payload
  );

  return data;
};

export default {
  loginApi,
};