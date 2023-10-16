import {api} from '../../api/api';

export type CategoryBase = {
  id: number;
  name: string;
  color: string;
  icon: string;
  parent: string;
};

export type Subcategory = CategoryBase;

export type Category = CategoryBase & {
  subcategories: Subcategory[];
};

export const categoryApi = api.injectEndpoints({
  endpoints: builder => ({
    getCategories: builder.query<Category[], void>({
      query: () => ({url: '/v1/transactions/categories/', method: 'GET'}),
    }),
  }),
});

export const {useGetCategoriesQuery} = categoryApi;
