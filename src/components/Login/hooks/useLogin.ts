import { signInWithEmailAndPassword } from "firebase/auth";
import { navigate } from "gatsby";
import { ChangeEvent, FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { auth } from "../../../firebase";

export const useLogin = () => {
  const { t } = useTranslation("common");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const validate = (): string | null => {
    if (!email || !password) return t("validate_input");
    if (!/\S+@\S+\.\S+/.test(email)) return t("validate_email");
    if (password.length < 6) return t("validate_password");
    return null;
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err: any) {
      switch (err.code) {
        case "auth/invalid-email":
          setError(t("email_format"));
          break;
        case "auth/user-not-found":
          setError(t(""));
          break;
        case "auth/wrong-password":
          setError(t("email_wrong"));
          break;
        default:
          setError(t("login_failed"));
      }
    } finally {
      setLoading(false);
    }
  };
  return {
    email,
    error,
    loading,
    handleLogin,
    password,
    onChange: { onChangeEmail, onChangePassword },
  };
};
