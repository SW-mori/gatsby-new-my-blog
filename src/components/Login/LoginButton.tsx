import React, { useEffect, useState } from "react";
import {
  getCurrentUser,
  initIdentity,
  login,
  logout,
  onLogin,
  onLogout,
} from "../../utils";

export const LoginButton: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    initIdentity();

    setUser(getCurrentUser());

    onLogin((user) => setUser(user));
    onLogout(() => setUser(null));
  }, []);

  if (user) {
    return (
      <div>
        <span>こんにちは、{user.user_metadata.full_name || user.email}</span>
        <button onClick={logout}>ログアウト</button>
      </div>
    );
  }

  return <button onClick={login}>ログイン</button>;
};
