import axios, {AxiosRequestConfig} from 'axios';
import Keychain from 'react-native-keychain';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import {BASE_URL} from '../../config';
import {store} from '../../store';
import {logout, setCredentials} from '../../store/auth/authSlice';

class AuthAxios {
  private axiosInstance = axios.create({
    baseURL: BASE_URL,
  });

  constructor() {
    this.axiosInstance.interceptors.request.use(
      async config => {
        const credentials = await Keychain.getGenericPassword();
        if (credentials && credentials.username === 'token') {
          const tokens = JSON.parse(credentials.password);
          config.headers.Authorization = `Bearer ${tokens.accessToken}`;
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      },
    );

    createAuthRefreshInterceptor(this.axiosInstance, this.refreshAuthLogic);

    // this.axiosInstance.interceptors.response.use(
    //   response => {
    //     return response;
    //   },
    //   async error => {
    //     // await this.checkUnauthenticated(error);
    //     return Promise.reject(error);
    //   },
    // );
  }

  async request(config: AxiosRequestConfig) {
    return await this.axiosInstance(config);
  }

  // private checkUnauthenticated = async (error: any) => {
  //   if (error.response && error.response.status === 401) {
  //     const authContext = useContext(AuthContext) as AuthContextProps;
  //     console.log('logout');
  //     await authContext.logout();
  //     await Keychain.resetGenericPassword();
  //   }
  // };

  private refreshAuthLogic = async (failedRequest: any) => {
    const credentials = await Keychain.getGenericPassword();
    const tokens =
      credentials && credentials.username === 'token'
        ? JSON.parse(credentials.password)
        : null;
    console.log('tokens', tokens);
    const options: AxiosRequestConfig = {
      method: 'POST',
      data: {refresh: tokens?.refreshToken},
      url: `${BASE_URL}/v1/token/refresh/`,
    };
    console.log('refresh token', options, 'gettens', tokens);

    try {
      const tokenRefreshResponse = await axios(options);
      failedRequest.response.config.headers.Authorization =
        'Bearer ' + tokenRefreshResponse.data.access;
      store.dispatch(
        setCredentials({
          accessToken: tokenRefreshResponse.data.access,
          refreshToken: tokenRefreshResponse.data.refresh,
        }),
      );
    } catch (error) {
      store.dispatch(logout());
      return Promise.reject(error);
      // Optionally: handle logout or other behaviors as needed
    }
  };
}

export const authAxios = new AuthAxios();
