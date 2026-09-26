import { BaseService } from "@/services/base-service";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import { tokenStorage } from "@/services/token-storage";
import { ApiResponse } from "@/types/api";
import { User, LoginResponse, OAuthProvider, ActiveSession } from "../types";
import {
  LoginInput,
  SignupInput,
  MfaVerificationInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  VerifyEmailInput,
  ChangePasswordInput,
  DeleteAccountInput,
} from "../schemas";

export class AuthService extends BaseService {
  constructor() {
    super("");
  }

  /**
   * Primary Email/Password Login
   */
  async login(payload: LoginInput): Promise<ApiResponse<LoginResponse>> {
    const res = await this.client.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, payload, {
      requiresAuth: false,
    });
    if (res.data.session?.accessToken) {
      tokenStorage.setDemoMode(false);
      tokenStorage.setToken(res.data.session.accessToken);
    }
    return res;
  }

  /**
   * Account Signup
   */
  async signup(payload: SignupInput): Promise<ApiResponse<LoginResponse>> {
    const res = await this.client.post<LoginResponse>(API_ENDPOINTS.AUTH.REGISTER, payload, {
      requiresAuth: false,
    });
    if (res.data.session?.accessToken) {
      tokenStorage.setDemoMode(false);
      tokenStorage.setToken(res.data.session.accessToken);
    }
    return res;
  }

  /**
   * OAuth Provider Initiation (Google / GitHub / Microsoft)
   * Client-side redirection to secure Gateway OAuth endpoint
   */
  initiateOAuth(provider: OAuthProvider): void {
    if (typeof window !== "undefined") {
      const redirectUrl = `${window.location.origin}/dashboard`;
      window.location.href = `${this.endpoint(API_ENDPOINTS.AUTH.LOGIN)}/oauth/${provider}?redirect_uri=${encodeURIComponent(redirectUrl)}`;
    }
  }

  /**
   * Isolated Guest Demo Environment Login
   * Uses simulated in-memory state; never accesses or leaks real tenant data.
   */
  async loginGuestDemo(): Promise<ApiResponse<LoginResponse>> {
    tokenStorage.setDemoMode(true);

    const demoUser: User = {
      id: "usr_demo_isolated_001",
      email: "guest@finora.demo",
      fullName: "Demo Allocator",
      role: "viewer",
      mfaEnabled: false,
      isDemo: true,
      createdAt: new Date().toISOString(),
    };

    const demoResponse: LoginResponse = {
      session: {
        user: demoUser,
        accessToken: "finora_demo_memory_token_transient",
        expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
        isDemo: true,
      },
    };

    tokenStorage.setToken(demoResponse.session!.accessToken);

    return {
      success: true,
      data: demoResponse,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Multi-Factor Authentication Verification
   */
  async verifyMfa(payload: MfaVerificationInput): Promise<ApiResponse<LoginResponse>> {
    const res = await this.client.post<LoginResponse>(API_ENDPOINTS.AUTH.MFA_VERIFY, payload, {
      requiresAuth: false,
    });
    if (res.data.session?.accessToken) {
      tokenStorage.setToken(res.data.session.accessToken);
    }
    return res;
  }

  /**
   * Forgot Password request (Sends secure one-time link)
   */
  async forgotPassword(payload: ForgotPasswordInput): Promise<ApiResponse<{ message: string }>> {
    return this.client.post<{ message: string }>(API_ENDPOINTS.AUTH.PASSWORD_RESET, payload, {
      requiresAuth: false,
    });
  }

  /**
   * Reset Password with token
   */
  async resetPassword(payload: ResetPasswordInput): Promise<ApiResponse<{ message: string }>> {
    return this.client.post<{ message: string }>(`${API_ENDPOINTS.AUTH.PASSWORD_RESET}/confirm`, payload, {
      requiresAuth: false,
    });
  }

  /**
   * Verify Email Address with 6-digit code
   */
  async verifyEmail(payload: VerifyEmailInput): Promise<ApiResponse<{ verified: boolean }>> {
    return this.client.post<{ verified: boolean }>("/auth/verify-email", payload, {
      requiresAuth: false,
    });
  }

  /**
   * Get Current Authenticated User or Demo Profile
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    if (tokenStorage.isDemo()) {
      return {
        success: true,
        data: {
          id: "usr_demo_isolated_001",
          email: "guest@finora.demo",
          fullName: "Demo Allocator",
          role: "viewer",
          mfaEnabled: false,
          isDemo: true,
          createdAt: new Date().toISOString(),
        },
        timestamp: new Date().toISOString(),
      };
    }
    return this.client.get<User>(API_ENDPOINTS.AUTH.ME);
  }

  /**
   * Get Active Sessions for Security Audit
   */
  async getActiveSessions(): Promise<ApiResponse<ActiveSession[]>> {
    if (tokenStorage.isDemo()) {
      return {
        success: true,
        data: [
          {
            id: "sess_demo_current",
            device: "Browser Session",
            browser: "Current Browser",
            ipRedacted: "192.168.***.***",
            location: "Local Sandbox",
            lastActiveAt: new Date().toISOString(),
            isCurrent: true,
            isSuspicious: false,
          },
        ],
        timestamp: new Date().toISOString(),
      };
    }
    return this.client.get<ActiveSession[]>("/auth/sessions");
  }

  /**
   * Revoke a single session
   */
  async revokeSession(sessionId: string): Promise<ApiResponse<void>> {
    return this.client.delete<void>(`/auth/sessions/${sessionId}`);
  }

  /**
   * Revoke all other active sessions except current
   */
  async revokeAllOtherSessions(): Promise<ApiResponse<void>> {
    return this.client.post<void>("/auth/sessions/revoke-others");
  }

  /**
   * Change Password
   */
  async changePassword(payload: ChangePasswordInput): Promise<ApiResponse<void>> {
    return this.client.post<void>("/auth/change-password", payload);
  }

  /**
   * Delete Account
   */
  async deleteAccount(payload: DeleteAccountInput): Promise<ApiResponse<void>> {
    return this.client.post<void>("/auth/delete-account", payload);
  }

  /**
   * End Session / Logout
   */
  async logout(): Promise<void> {
    try {
      if (!tokenStorage.isDemo()) {
        await this.client.post(API_ENDPOINTS.AUTH.LOGOUT);
      }
    } finally {
      tokenStorage.clearToken();
      tokenStorage.setDemoMode(false);
    }
  }
}

export const authService = new AuthService();
