/**
 * Secure In-Memory Token & Session Storage
 * IMPORTANT: Access tokens and sensitive JWT secrets are NEVER persisted to localStorage.
 * Tokens live in memory during the browser session lifecycle.
 */

type TokenChangeListener = (token: string | null) => void;
type SessionExpireListener = () => void;

class TokenStorage {
  private accessToken: string | null = null;
  private isDemoMode: boolean = false;
  private tokenListeners: Set<TokenChangeListener> = new Set();
  private expireListeners: Set<SessionExpireListener> = new Set();

  constructor() {
    if (typeof window !== "undefined") {
      // Check if temporary demo session flag exists in sessionStorage (isolated to current tab only)
      this.isDemoMode = sessionStorage.getItem("finora_demo_active") === "true";
    }
  }

  /**
   * Retrieves the in-memory access token.
   */
  getToken(): string | null {
    return this.accessToken;
  }

  /**
   * Updates the in-memory access token and notifies subscribers.
   */
  setToken(token: string | null): void {
    this.accessToken = token;
    this.notifyToken();
  }

  /**
   * Clears tokens and session on logout or session expiration.
   */
  clearToken(): void {
    this.accessToken = null;
    this.notifyToken();
  }

  /**
   * Activates isolated guest demo mode.
   */
  setDemoMode(active: boolean): void {
    this.isDemoMode = active;
    if (typeof window !== "undefined") {
      if (active) {
        sessionStorage.setItem("finora_demo_active", "true");
      } else {
        sessionStorage.removeItem("finora_demo_active");
      }
    }
    this.notifyToken();
  }

  /**
   * Checks if user is browsing in isolated guest demo mode.
   */
  isDemo(): boolean {
    return this.isDemoMode;
  }

  /**
   * Triggered when a 401 Unauthorized occurs from the API Gateway.
   */
  notifySessionExpired(): void {
    this.accessToken = null;
    for (const listener of this.expireListeners) {
      try {
        listener();
      } catch (err) {
        console.error("Session expire listener error:", err);
      }
    }
  }

  subscribe(listener: TokenChangeListener): () => void {
    this.tokenListeners.add(listener);
    return () => {
      this.tokenListeners.delete(listener);
    };
  }

  onSessionExpired(listener: SessionExpireListener): () => void {
    this.expireListeners.add(listener);
    return () => {
      this.expireListeners.delete(listener);
    };
  }

  private notifyToken(): void {
    for (const listener of this.tokenListeners) {
      try {
        listener(this.accessToken);
      } catch (err) {
        console.error("Token storage listener error:", err);
      }
    }
  }
}

export const tokenStorage = new TokenStorage();
