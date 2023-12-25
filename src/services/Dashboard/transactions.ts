import {api} from '../api/api';

export interface TransactionBase {
  amount: number;
  description: string;
  category: number;
  wallet: number;
  transaction_date: string;
  readonly currency_symbol: string;
}

export type Transaction = TransactionBase & {
  id: number;
};

export interface ListResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

const apiWithTag = api.enhanceEndpoints({
  addTagTypes: ['Transactions'],
});

export const transactionApi = apiWithTag.injectEndpoints({
  endpoints: builder => ({
    getTransactions: builder.query<
      ListResponse<Transaction>,
      {
        page?: number;
        transaction_date__date?: string;
        transaction_date__date__gte?: string;
        transaction_date__date__lte?: string;
      }
    >({
      query: params => ({
        url: '/v1/transactions/transactions/',
        method: 'GET',
        params: {
          page: params?.page || 1,
          page_size: 20,
          ...params,
        },
      }),
    }),
  }),
});

export const getDateFilterParams = (selectedTab: string) => {
  const today = new Date();
  const oneDayMs = 24 * 60 * 60 * 1000;

  switch (selectedTab) {
    case 'recent':
      return {}; // No additional filters for recent transactions
    case 'today':
      return {
        transaction_date__date: today.toISOString().split('T')[0], // Format: "YYYY-MM-DD"
      };
    case 'yesterday':
      const yesterday = new Date(today.getTime() - oneDayMs);
      return {
        transaction_date__date: yesterday.toISOString().split('T')[0],
      };
    case 'lastweek':
      const lastWeekStart = new Date(today.getTime() - 7 * oneDayMs);
      return {
        transaction_date__date__gte: lastWeekStart.toISOString().split('T')[0],
      };
    case 'lastmonth':
      const lastMonthStart = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        today.getDate(),
      );
      return {
        transaction_date__date__gte: lastMonthStart.toISOString().split('T')[0],
      };
    default:
      return {};
  }
};

export const {useGetTransactionsQuery} = transactionApi;
