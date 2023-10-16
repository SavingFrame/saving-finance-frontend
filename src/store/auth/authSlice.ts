import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import Keychain from 'react-native-keychain';

type AuthState = {
  authenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
};

const initialState: AuthState = {
  authenticated: false,
  accessToken: null,
  refreshToken: null,
  // add other state related to auth as required
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      {
        payload: {accessToken, refreshToken},
      }: PayloadAction<{accessToken: string; refreshToken: string}>,
    ) => {
      state.accessToken = accessToken;
      state.authenticated = true;
      state.refreshToken = refreshToken;
      Keychain.setGenericPassword(
        'token',
        JSON.stringify({accessToken, refreshToken}),
      );
    },
    logout: state => {
      state.authenticated = false;
      Keychain.resetGenericPassword();
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
});

export const {setCredentials, logout} = authSlice.actions;

export default authSlice.reducer;
export type AuthStateType = ReturnType<typeof authSlice.reducer>;
