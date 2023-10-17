import {api} from '../../api/api';

export type CategoryBase = {
  name: string;
  color: string;
  icon: string;
  parent: number | null;
};

export type Subcategory = CategoryBase & {
  id: number;
};

export type Category = CategoryBase & {
  subcategories: Subcategory[];
  id: number;
};

export type CreateCategory = CategoryBase & {};

const apiWithTag = api.enhanceEndpoints({
  addTagTypes: ['Categories'],
});
export const categoryApi = apiWithTag.injectEndpoints({
  endpoints: builder => ({
    getCategories: builder.query<Category[], void>({
      query: () => ({url: '/v1/transactions/categories/', method: 'GET'}),
      providesTags: result =>
        // is result available?
        result
          ? // successful query
            [
              ...result.map(({id}) => ({type: 'Categories', id} as const)),
              {type: 'Categories', id: 'LIST'},
            ]
          : // an error occurred, but we still want to refetch this
            // query when `{ type: 'Posts', id: 'LIST' }` is invalidated
            [{type: 'Categories', id: 'LIST'}],
    }),
    createCategory: builder.mutation<Category, CreateCategory>({
      query: body => ({
        url: '/v1/transactions/categories/',
        method: 'POST',
        data: body,
      }),
      invalidatesTags: [{type: 'Categories', id: 'LIST'}],
    }),
    updateCategory: builder.mutation<
      Category,
      Partial<Category> & Pick<Category, 'id'>
    >({
      query: ({id, ...body}) => ({
        url: `/v1/transactions/categories/${id}/`,
        method: 'PATCH',
        data: body,
      }),
      invalidatesTags: (result, error, {id}) => [{type: 'Categories', id}],
    }),
    deleteCategory: builder.mutation<void, number>({
      query: id => ({
        url: `/v1/transactions/categories/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{type: 'Categories', id}],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
