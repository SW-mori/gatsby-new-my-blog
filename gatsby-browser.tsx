import { logErrorToServer } from "./src/utils";
import { AuthProvider } from "./src/context/AuthContext";
import React from "react";

declare global {
  interface Window {
    dataLayer: Record<string, any>[];
  }
}

export const onRouteUpdate = ({ location }: { location: Location }) => {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];

  window.dataLayer.push({
    event: "page_view",
    page_path: location.pathname + location.search,
    page_location: window.location.href,
    page_title: document.title,
  });

  if (process.env.NODE_ENV === "development") {
    console.log("[GTM] page_view sent:", location.pathname);
  }
};

export const wrapRootElement = ({ element }: { element: React.ReactNode }) => {
  return <AuthProvider>{element}</AuthProvider>;
};

export const onClientEntry = () => {
  window.addEventListener("error", (event) => {
    if (event.error) {
      logErrorToServer(event.error);
    }
  });

  window.addEventListener("unhandledrejection", (event) => {
    if (event.reason instanceof Error) {
      logErrorToServer(event.reason);
    } else {
      logErrorToServer(new Error(String(event.reason)));
    }
  });
};
