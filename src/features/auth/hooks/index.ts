"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "../services";
import { tokenStorage } from "@/services/token-storage";
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

export const AUTH_QUERY_KEY = ["auth", "currentUser"] as const;
export const SESSIONS_QUERY_KEY = ["auth", "activeSessions"] as const;

export function useCurrentUser() {
  return useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async () => {
      const res = await authService.getCurrentUser();
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: LoginInput) => authService.login(credentials),
    onSuccess: (response) => {
      if (response.data.requiresMfa) {
        // Redirect to MFA with ticket
        router.push(`/mfa?ticket=${encodeURIComponent(response.data.mfaTicket || "")}`);
      } else if (response.data.session?.user) {
        queryClient.setQueryData(AUTH_QUERY_KEY, response.data.session.user);
        router.push("/dashboard");
      }
    },
  });
}

export function useSignup() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: SignupInput) => authService.signup(payload),
    onSuccess: (response) => {
      if (response.data.session?.user) {
        queryClient.setQueryData(AUTH_QUERY_KEY, response.data.session.user);
        router.push("/verify-email");
      }
    },
  });
}

export function useGuestDemoLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => authService.loginGuestDemo(),
    onSuccess: (response) => {
      if (response.data.session?.user) {
        queryClient.setQueryData(AUTH_QUERY_KEY, response.data.session.user);
        router.push("/dashboard");
      }
    },
  });
}

export function useVerifyMfa() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: MfaVerificationInput) => authService.verifyMfa(payload),
    onSuccess: (response) => {
      if (response.data.session?.user) {
        queryClient.setQueryData(AUTH_QUERY_KEY, response.data.session.user);
        router.push("/dashboard");
      }
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordInput) => authService.forgotPassword(payload),
  });
}

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: ResetPasswordInput) => authService.resetPassword(payload),
    onSuccess: () => {
      router.push("/login?reset=success");
    },
  });
}

export function useVerifyEmail() {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: VerifyEmailInput) => authService.verifyEmail(payload),
    onSuccess: () => {
      router.push("/dashboard?verified=true");
    },
  });
}

export function useActiveSessions() {
  return useQuery({
    queryKey: SESSIONS_QUERY_KEY,
    queryFn: async () => {
      const res = await authService.getActiveSessions();
      return res.data;
    },
  });
}

export function useRevokeSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => authService.revokeSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SESSIONS_QUERY_KEY });
    },
  });
}

export function useRevokeAllOtherSessions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.revokeAllOtherSessions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SESSIONS_QUERY_KEY });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordInput) => authService.changePassword(payload),
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: DeleteAccountInput) => authService.deleteAccount(payload),
    onSuccess: () => {
      tokenStorage.clearToken();
      queryClient.clear();
      router.push("/login?deleted=true");
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      queryClient.clear();
      router.push("/login");
    },
  });
}
