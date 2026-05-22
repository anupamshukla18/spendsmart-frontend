import { Injectable } from "@angular/core";
import { APP_CONFIG } from "../config/app.config";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;

          renderButton: (
            parent: HTMLElement,
            options?: {
              type?: string;
              theme?: string;
              size?: string;
              text?: string;
              width?: number;
              shape?: string;
              logo_alignment?: string;
            },
          ) => void;

          prompt: () => void;
        };
      };
    };
  }
}

@Injectable({
  providedIn: "root",
})
export class GoogleAuthService {
  private scriptLoaded = false;
  private scriptLoadingPromise?: Promise<void>;
  private initialized = false;

  private credentialCallback?: (token: string) => void;

  /**
   * Load Google Identity Services SDK
   */
  private loadGoogleScript(): Promise<void> {
    if (this.scriptLoaded) {
      return Promise.resolve();
    }

    if (this.scriptLoadingPromise) {
      return this.scriptLoadingPromise;
    }

    this.scriptLoadingPromise = new Promise<void>((resolve, reject) => {
      const existingScript = document.getElementById("google-gsi-script");

      if (existingScript) {
        this.scriptLoaded = true;
        resolve();
        return;
      }

      const script = document.createElement("script");

      script.id = "google-gsi-script";

      script.src = "https://accounts.google.com/gsi/client";

      script.async = true;

      script.defer = true;

      script.onload = () => {
        this.scriptLoaded = true;
        resolve();
      };

      script.onerror = () => {
        reject(new Error("Failed to load Google Identity Services"));
      };

      document.head.appendChild(script);
    });

    return this.scriptLoadingPromise;
  }

  /**
   * Initialize Google Sign-In
   */
  private initializeGoogle(): void {
    if (this.initialized) {
      return;
    }

    if (!window.google?.accounts?.id) {
      throw new Error("Google SDK not available");
    }

    if (!APP_CONFIG.googleClientId) {
      throw new Error("Google Client ID is missing");
    }

    window.google.accounts.id.initialize({
      client_id: APP_CONFIG.googleClientId,

      callback: (response: { credential: string }) => {
        if (!response?.credential) {
          console.error("Google credential missing");
          return;
        }

        this.credentialCallback?.(response.credential);
      },

      auto_select: false,

      cancel_on_tap_outside: true,
    });

    this.initialized = true;
  }

  /**
   * Render Google button
   */
  async renderButton(
    container: HTMLElement,
    callback: (token: string) => void,
  ): Promise<void> {
    await this.loadGoogleScript();

    if (!window.google?.accounts?.id) {
      throw new Error("Google Sign-In unavailable");
    }

    this.credentialCallback = callback;

    this.initializeGoogle();

    container.innerHTML = "";

    window.google.accounts.id.renderButton(container, {
      type: "standard",
      theme: "outline",
      size: "large",
      text: "continue_with",
      width: 350,
      shape: "pill",
      logo_alignment: "left",
    });
  }

  /**
   * OAuth redirect flow
   */
  signInWithRedirect(): void {
    window.location.href = "http://localhost:8080/api/oauth2/authorization/google";
  }
}
