import { createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

const apiUrl = import.meta.env.VITE_API_URL;

const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({baseUrl: apiUrl, credentials: 'include',}),
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
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/products/delete/${id}`,
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            }),
            invalidatesTags: ['Products']

        }),
        updateProduct: builder.mutation({
            query: ({id, updatedData}) => ({
                url: `/products/updateproduct/${id}`,
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: updatedData
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
        deleteWholesaleClient: builder.mutation({
            query: (id) => ({
                url: `/wholesaleClient/delete/${id}`,
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            }),
            invalidatesTags: ['WholesaleClients']

        }),
        updateWholesaleClient: builder.mutation({
            query: ({id, updatedData}) => ({
                url: `/wholesaleClient/update/${id}`,
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: updatedData
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
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/user/deleteuser/${id}`,
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            }),
            invalidatesTags: ['Users']

        }),
        updateUser: builder.mutation({
            query: ({id, updatedData}) => ({
                url: `/user/updateuser/${id}`,
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: updatedData
            }),
            invalidatesTags: ['Users']
        }),

        // // Initial Setup Endpoints
        // checkSetupStatus: builder.query({
        //     query: () => ({
        //         url: '/initialsetup/check-setup',
        //     })
        //   }),
        
    })
});

export const {useFetchProductsQuery, useCreateProductMutation, useDeleteProductMutation, useUpdateProductMutation, useFetchCategoriesQuery, useCreateCategoryMutation, useDeleteCategoryMutation, useUpdateCategoryMutation, useFetchSalesQuery, useFetchWholesaleClientsQuery, useCreateWholesaleClientMutation, useDeleteWholesaleClientMutation, useUpdateWholesaleClientMutation, useFetchUsersQuery, useCreateUserMutation, useDeleteUserMutation, useUpdateUserMutation, useCheckSetupStatusQuery} = apiSlice;
export default apiSlice;