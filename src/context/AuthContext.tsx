import React, { createContext, ReactNode, useState } from "react";
import * as Keychain from 'react-native-keychain';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  authenticated: boolean;
}

interface AuthContextProps {
  authState: AuthState;
  getAccessToken: () => string | null;
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;
  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextProps | null>(null);

// @ts-ignore
const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const [authState, setAuthState] = useState<AuthState>({
    accessToken: null,
    refreshToken: null,
    authenticated: false,
  });

  const logout = async () => {
    await Keychain.resetGenericPassword();
    setAuthState({
      accessToken: null,
      refreshToken: null,
      authenticated: false,
    });
  };

  const getAccessToken = () => {
    return authState.accessToken;
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        getAccessToken,
        setAuthState,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export {AuthProvider, AuthContext};
export type {AuthContextProps};
