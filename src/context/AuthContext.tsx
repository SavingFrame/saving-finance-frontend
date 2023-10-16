import React, {createContext, ReactNode, useState} from 'react';
import * as Keychain from 'react-native-keychain';

interface AuthState {
  authenticated: boolean;
}

interface AuthContextProps {
  authState: AuthState;
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
    authenticated: false,
  });

  const logout = async () => {
    await Keychain.resetGenericPassword();
    setAuthState({
      authenticated: false,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        setAuthState,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export {AuthProvider, AuthContext};
export type {AuthContextProps};
