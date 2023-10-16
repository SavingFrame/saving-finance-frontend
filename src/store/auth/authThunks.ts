import {createAsyncThunk} from '@reduxjs/toolkit';
import publicAxios from "../../services/api/publicAxios";

export const login = createAsyncThunk('auth/login', async credentials => {
  const response = await publicAxios.request({
    url: '/v1/token/',
    method: 'POST',
    data: credentials,
  });
  return response.data;
});
