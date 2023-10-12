import React, {createContext, useContext, FC, ReactNode} from 'react';
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import * as Keychain from 'react-native-keychain';
import {AuthContext, AuthContextProps} from './AuthContext'; // Make sure to import AuthContextProps from your actual AuthContext file

interface AxiosProviderProps {
  children: ReactNode;
}

interface AxiosContextProps {
  authAxios: AxiosInstance;
  publicAxios: AxiosInstance;
}

const AxiosContext = createContext<AxiosContextProps | null>(null);

const AxiosProvider: FC<AxiosProviderProps> = ({children}) => {
  const authContext = useContext(AuthContext) as AuthContextProps;

  const authAxios = axios.create({
    baseURL: 'http://192.168.100.16:8000/api',
  });

  const publicAxios = axios.create({
    baseURL: 'http://192.168.100.16:8000/api',
  });

  authAxios.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (!config.headers?.Authorization) {
        config.headers.Authorization = `Bearer ${authContext.getAccessToken()}`;
      }

      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );

  const refreshAuthLogic = (failedRequest: any) => {
    const data = {
      refreshToken: authContext.authState.refreshToken,
    };

    const options: AxiosRequestConfig = {
      method: 'POST',
      data,
      url: 'http://192.168.100.16:8000/api/v1/token/refresh/',
    };

    return axios(options)
      .then(async tokenRefreshResponse => {
        failedRequest.response.config.headers.Authorization =
          'Bearer ' + tokenRefreshResponse.data.accessToken;

        authContext.setAuthState({
          ...authContext.authState,
          accessToken: tokenRefreshResponse.data.accessToken,
        });

        await Keychain.setGenericPassword(
          'token',
          JSON.stringify({
            accessToken: tokenRefreshResponse.data.accessToken,
            refreshToken: authContext.authState.refreshToken,
          }),
        );

        return Promise.resolve();
      })
      .catch(e => {
        console.log('error', e);
        authContext.setAuthState({
          accessToken: null,
          refreshToken: null,
          authenticated: false,
        });
      });
  };

  createAuthRefreshInterceptor(authAxios, refreshAuthLogic, {});

  return (
    <AxiosContext.Provider
      value={{
        authAxios,
        publicAxios,
      }}>
      {children}
    </AxiosContext.Provider>
  );
};

export {AxiosContext, AxiosProvider};
export type {AxiosContextProps};
