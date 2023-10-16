import type {BaseQueryFn} from '@reduxjs/toolkit/query';
import type {AxiosError, AxiosRequestConfig} from 'axios';
import {createApi} from '@reduxjs/toolkit/dist/query/react';
import {authAxios} from './authAxios';

export const axiosBaseQuery: BaseQueryFn<
  {
    url: string;
    method: AxiosRequestConfig['method'];
    data?: AxiosRequestConfig['data'];
    params?: AxiosRequestConfig['params'];
  },
  unknown,
  unknown
> = async ({url, method, data, params}) => {
  try {
    const result = await authAxios.request({
      url,
      method,
      data,
      params,
    });
    return {data: result.data};
  } catch (axiosError) {
    const err = axiosError as AxiosError;
    return {
      error: {
        status: err.response?.status,
        data: err.response?.data || err.message,
      },
    };
  }
};

export const api = createApi({
  baseQuery: axiosBaseQuery,
  endpoints: () => ({}),
});
