"use client";

import { Button } from "@/components/ui/button";
import { OAuthProvider } from "../types";
import { authService } from "../services";

export interface OAuthProvidersProps {
  isLoading?: boolean;
}

export function OAuthProviders({ isLoading = false }: OAuthProvidersProps) {
  const handleOAuth = (provider: OAuthProvider) => {
    authService.initiateOAuth(provider);
  };

  return (
    <div className="space-y-3">
      <div className="relative flex items-center justify-center">
        <div className="w-full border-t border-border" />
        <span className="absolute bg-card px-3 text-[11px] font-semibold uppercase text-muted-foreground tracking-wider">
          Or continue with
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2.5 pt-1">
        {/* Google */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isLoading}
          onClick={() => handleOAuth("google")}
          className="h-10 border-border/80 hover:bg-accent hover:border-border text-xs"
          aria-label="Continue with Google"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.665-5.17 3.665-9.12z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.27 21.44 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.57H1.25C.45 8.16 0 9.98 0 12s.45 3.84 1.25 5.43l4.03-3.14z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.27 2.56 1.25 6.57l4.03 3.14c.95-2.83 3.6-4.96 6.72-4.96z"
            />
          </svg>
          <span className="sr-only sm:not-sr-only sm:ml-1.5">Google</span>
        </Button>

        {/* GitHub */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isLoading}
          onClick={() => handleOAuth("github")}
          className="h-10 border-border/80 hover:bg-accent hover:border-border text-xs"
          aria-label="Continue with GitHub"
        >
          <svg className="h-4 w-4 fill-foreground" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          <span className="sr-only sm:not-sr-only sm:ml-1.5">GitHub</span>
        </Button>

        {/* Microsoft / SSO */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isLoading}
          onClick={() => handleOAuth("microsoft")}
          className="h-10 border-border/80 hover:bg-accent hover:border-border text-xs"
          aria-label="Continue with Microsoft SSO"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path fill="#F25022" d="M1 1h10v10H1z" />
            <path fill="#00A4EF" d="M1 13h10v10H1z" />
            <path fill="#7FBA00" d="M13 1h10v10H13z" />
            <path fill="#FFB900" d="M13 13h10v10H13z" />
          </svg>
          <span className="sr-only sm:not-sr-only sm:ml-1.5">SSO</span>
        </Button>
      </div>
    </div>
  );
}
