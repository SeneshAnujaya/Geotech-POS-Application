import { createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:3000/api'}),
    // tagTypes: ['Products', 'Sales', 'Categories'],
    endpoints: (builder) => ({

        // Products EndPoints
        fetchProducts: builder.query({
            query: () => '/products/getproducts',
            providesTags: ['Products']
        }),

        // Category Endpoints
        fetchCategories: builder.query({
            query: () => '/category/getCategories'
        }),

        // Sales Endpoints
        fetchSales: builder.query({
            query: () => '/sales/getSales',
            // providesTags: ['Sales']
        }),

        // Wholesale clients Endpoints
        fetchWholesaleClients: builder.query({
            query: () => 'wholesaleClient/getBulkBuyers'
        }),

        // Users Endpoints
        fetchUsers: builder.query({
            query: () => 'user/getusers'
        })
    })
});

export const {useFetchProductsQuery, useFetchCategoriesQuery, useFetchSalesQuery, useFetchWholesaleClientsQuery, useFetchUsersQuery} = apiSlice;
export default apiSlice;