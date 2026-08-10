import { loginApi } from "../api/auth.api";

import type {
  LoginRequest,
  LoginResponse,
} from "../api/auth.api";

class AuthService {
  async login(
    payload: LoginRequest
  ): Promise<LoginResponse> {
    try {
      const response = await loginApi(payload);

      return response;
    } catch (error) {
      console.error("Login Error:", error);

      throw error;
    }
  }
}

export default new AuthService();