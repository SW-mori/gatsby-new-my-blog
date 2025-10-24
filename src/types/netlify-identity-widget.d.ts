declare module "netlify-identity-widget" {
  interface UserMetadata {
    full_name?: string;
    avatar_url?: string;
  }

  interface User {
    id: string;
    email: string;
    user_metadata: UserMetadata;
    token?: string;
    jwt?: string;
    [key: string]: any;
  }

  interface Identity {
    init(): void;
    open(): void;
    logout(): void;
    currentUser(): User | null;
    on(
      event: "login" | "logout" | string,
      callback: (user?: User) => void
    ): void;
  }

  const netlifyIdentity: Identity;
  export default netlifyIdentity;
}
