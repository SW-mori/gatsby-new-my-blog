import { LANGUAGES } from "../../../constants";
import { useAuth } from "../../../context";
import { navigate } from "gatsby";
import { useI18next } from "gatsby-plugin-react-i18next";

export const useHeader = () => {
  const { isAuthenticated, logout, loading } = useAuth();
  const { language, originalPath } = useI18next();
  const getPathForLanguage = (lng: string) => {
    if (lng === LANGUAGES.JA) {
      const path = originalPath.replace(/^\/en/, "");
      return path === `/${LANGUAGES.EN}/` ? "/" : path;
    } else {
      return originalPath === "/" ? `/${lng}/` : `/${lng}${originalPath}`;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("ログアウトエラー:", err);
    }
  };

  return {
    getPathForLanguage,
    handleLogout,
    isAuthenticated,
    language,
    loading,
  };
};
