import { createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

const apiUrl = import.meta.env.VITE_API_URL;

const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({baseUrl: apiUrl, credentials: 'include',}),
    tagTypes: ['Products', 'Sales', 'Categories', 'WholesaleClients', 'Users', 'Payments'],
    endpoints: (builder) => ({

        // Products EndPoints
        fetchProducts: builder.query({
            query: () => '/products/getproducts',
            providesTags: ['Products']
        }),

        fetchPaginatedProducts: builder.query({
            query: ({page = 0, limit = 20, searchTerm = ''}) => `/products/getpaginationProducts?page=${page}&limit=${limit}&searchTerm=${searchTerm}`,
            providesTags: ['Products']
        }),

        fetchFilteredPaginatedProducts: builder.query({
            query: ({category, search, page = 0, limit = 20}) => {
                const params = new URLSearchParams({
                    ...(category && {category}),
                    ...(search && {search}),
                    page: page.toString(),
                    limit: limit.toString()
                });
                return `/products/getfilteredPaginatedProducts?${params.toString()}`;

            },
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
        fetchFilteredCategories: builder.query({
            query: ({searchTerm = ''}) => {
                const params = new URLSearchParams({searchTerm});
                return `/category/getFilteredCategories?${params.toString()}`;
            },
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
            query: ({id, data}) => ({    
                url: `/category/updateCategory/${id}`,
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['Categories']
        }),


        // Sales Endpoints
        fetchSales: builder.query({
            query: () => '/sales/getSales',
            providesTags: ['Sales']
        }),

        fetchPaginatedSales: builder.query({
            query: ({page = 0, limit = 50, searchTerm=""}) => `/sales/getpaginationSales?page=${page}&limit=${limit}&searchTerm=${searchTerm}`,
            providesTags: ['Sales']
        }),

        fetchDueSales: builder.query({
            query: ({searchTerm = ""}) => `/sales/getDueSales?searchTerm=${searchTerm}`,
            porvidesTags: ['Sales']
        }),

        fetchReturnCancelSales: builder.query({
            query: ({searchTerm}) => `/sales/getReturnCancel?searchTerm=${searchTerm}`,
            providesTags: ['Sales']
        }),

        cancelSaleRecord: builder.mutation({
            query: (formData) => ({
                url: `/sales/cancelSale`,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: formData
            }),
            invalidatesTags: ['Sales']
        }),

        // Wholesale clients Endpoints
        fetchWholesaleClients: builder.query({
            query: ({searchTerm = ""}) => `/wholesaleClient/getBulkBuyers?searchTerm=${searchTerm}`,
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

        updateUserAccount: builder.mutation({
            query: (updatedData) => ({
                url: `/user/updateUserAccount/`,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: updatedData
            }),
            invalidatesTags: ['Users']
        }),
        

        // Paymetns Endpoints
        fetchSingleClientPayments: builder.query({
            query: (id) => `payment/getPayments/${id}`,
            providesTags: ['Payments']
            
        }),
        
    })
});

export const {useFetchProductsQuery, useFetchPaginatedProductsQuery, useFetchFilteredPaginatedProductsQuery, useCreateProductMutation, useDeleteProductMutation, useUpdateProductMutation, useFetchCategoriesQuery, useFetchFilteredCategoriesQuery, useCreateCategoryMutation, useDeleteCategoryMutation, useUpdateCategoryMutation, useFetchSalesQuery, useFetchPaginatedSalesQuery, useFetchDueSalesQuery, useFetchReturnCancelSalesQuery, useCancelSaleRecordMutation, useFetchWholesaleClientsQuery, useCreateWholesaleClientMutation, useDeleteWholesaleClientMutation, useUpdateWholesaleClientMutation, useFetchUsersQuery, useCreateUserMutation, useDeleteUserMutation, useUpdateUserMutation, useUpdateUserAccountMutation, useCheckSetupStatusQuery, useFetchSingleClientPaymentsQuery} = apiSlice;
export default apiSlice;