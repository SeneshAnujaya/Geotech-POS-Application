import { createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:3000/api', credentials: 'include',}),
    tagTypes: ['Products', 'Sales', 'Categories', 'WholesaleClients', 'Users'],
    endpoints: (builder) => ({

        // Products EndPoints
        fetchProducts: builder.query({
            query: () => '/products/getproducts',
            providesTags: ['Products']
        }),

        createProduct: builder.mutation({
            query: (formData) => ({
                url: '/products/add',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: formData,
                
            }),
            invalidatesTags: ['Products']
        }),

        // Category Endpoints
        fetchCategories: builder.query({
            query: () => '/category/getCategories',
            providesTags: ['Categories']
        }),
        createCategory: builder.mutation({
            query: (formData) => ({
                url: '/category/add',
                method: 'POST',
                body: formData
            }),
            invalidatesTags: ['Categories']
        }),
        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `/category/deleteCategory/${id}`,
                method: 'DELETE',

            }),
            invalidatesTags: ['Categories']
        }),
        updateCategory: builder.mutation({
            query: ({id, name}) => ({
                url: `/category/updateCategory/${id}`,
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: {name}
            }),
            invalidatesTags: ['Categories']
        }),


        // Sales Endpoints
        fetchSales: builder.query({
            query: () => '/sales/getSales',
            providesTags: ['Sales']
        }),

        // Wholesale clients Endpoints
        fetchWholesaleClients: builder.query({
            query: () => '/wholesaleClient/getBulkBuyers',
            providesTags: ['WholesaleClients']
        }),
        createWholesaleClient: builder.mutation({
            query: (formData) => ({
                url: '/wholesaleClient/add',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: formData
            }),
            invalidatesTags: ['WholesaleClients']
        }),

        // Users Endpoints
        fetchUsers: builder.query({
            query: () => '/user/getusers',
            providesTags: ['Users']
            
        }),
        createUser: builder.mutation({
            query: (formData) => ({
                url: '/auth/signup',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: formData
            }),
            invalidatesTags: ['Users']
        }),
        
    })
});

export const {useFetchProductsQuery, useCreateProductMutation, useFetchCategoriesQuery, useCreateCategoryMutation, useDeleteCategoryMutation, useUpdateCategoryMutation, useFetchSalesQuery, useFetchWholesaleClientsQuery, useCreateWholesaleClientMutation, useFetchUsersQuery, useCreateUserMutation} = apiSlice;
export default apiSlice;