import { ReactNode, createContext, useState } from "react";
import { type TUser } from "./client"

export interface TLoginContext {
  user: TUser | null,
  onLogin: (e: { user: TUser }) => void
  onLogout: () => void
};

const defaultState: TLoginContext = {
  user: null,
  onLogin: (_e) => { },
  onLogout: () => { }
}

export const LoginContext = createContext<TLoginContext>(defaultState);

export function LoginContextProvider({ children }: { children: ReactNode }) {
  const [loginState, setLoginState] = useState<TLoginContext>(defaultState);

  const onLogin = (e: { user: TUser }) => {
    setLoginState(prevState => ({
      ...prevState,
      user: e.user
    }));
  }

  const onLogout = () => {
    setLoginState(prevState => ({
      ...prevState,
      user: null
    }));
  }

  const contextValue: TLoginContext = {
    user: loginState.user,
    onLogin,
    onLogout
  };

  return (
    <LoginContext.Provider value={contextValue}>
      {children}
    </LoginContext.Provider>
  );
}