import netlifyIdentity from "netlify-identity-widget";

export const initIdentity = () => {
  if (typeof window !== "undefined") {
    netlifyIdentity.init();
  }
};

export const login = () => {
  netlifyIdentity.open();
};

export const logout = () => {
  netlifyIdentity.logout();
};

export const onLogin = (callback: (user: any) => void) => {
  netlifyIdentity.on("login", callback);
};

export const onLogout = (callback: () => void) => {
  netlifyIdentity.on("logout", callback);
};

export const getCurrentUser = () => {
  return netlifyIdentity.currentUser();
};
