import {api} from '../api/api';

export type WalletGroup = {
  id: number;
  name: string;
};

export type WalletBase = {
  name: string;
  group: number | null;
  balance: number;
  color: string;
  icon: string;
  balance_currency: string;
};

export type Wallet = WalletBase & {
  id: number;
  readonly currency_symbol?: string;
};

const apiWithTag = api.enhanceEndpoints({
  addTagTypes: ['Wallets', 'WalletGroups'],
});

export const walletApi = apiWithTag.injectEndpoints({
  endpoints: builder => ({
    getWallets: builder.query<Wallet[], void>({
      query: () => ({url: '/v1/wallets/wallets/', method: 'GET'}),
      providesTags: result =>
        // is result available?
        result
          ? // successful query
            [
              ...result.map(({id}) => ({type: 'Wallets', id} as const)),
              {type: 'Wallets', id: 'LIST'},
            ]
          : // an error occurred, but we still want to refetch this
            // query when `{ type: 'Posts', id: 'LIST' }` is invalidated
            [{type: 'Wallets', id: 'LIST'}],
    }),
    getWalletGroups: builder.query<WalletGroup[], void>({
      query: () => ({url: '/v1/wallets/groups/', method: 'GET'}),
      providesTags: result =>
        // is result available?
        result
          ? // successful query
            [
              ...result.map(({id}) => ({type: 'WalletGroups', id} as const)),
              {type: 'WalletGroups', id: 'LIST'},
            ]
          : // an error occurred, but we still want to refetch this
            // query when `{ type: 'Posts', id: 'LIST' }` is invalidated
            [{type: 'WalletGroups', id: 'LIST'}],
    }),
    createWallet: builder.mutation<Wallet, WalletBase>({
      query: body => ({
        url: '/v1/wallets/wallets/',
        method: 'POST',
        data: body,
      }),
      invalidatesTags: [{type: 'Wallets', id: 'LIST'}],
    }),
    updateWallet: builder.mutation<
      Wallet,
      Partial<Wallet> & Pick<Wallet, 'id'>
    >({
      query: ({id, ...body}) => ({
        url: `/v1/wallets/wallets/${id}/`,
        method: 'PATCH',
        data: body,
      }),
      invalidatesTags: (result, error, {id}) => [{type: 'Wallets', id}],
    }),
  }),
});

export const {
  useGetWalletsQuery,
  useGetWalletGroupsQuery,
  useCreateWalletMutation,
  useUpdateWalletMutation,
} = walletApi;
