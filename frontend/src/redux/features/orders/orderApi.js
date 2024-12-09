import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getBaseUrl } from '../../../utils/baseURL';

const orderApi = createApi({
    reducerPath: 'orderApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${getBaseUrl()}/api/orders`,
        credentials: 'include'
    }),
    tagTypes: ["Order"],
    endpoints: (builder) => ({
        CreateOrder: builder.mutation({
            query: (newOrder) => ({
              url: "/checkout",
              method: "POST",
              body: newOrder,
              credentials: "include",
            }),
            invalidatesTags: ["Order"],
          }),
        getOrdersByEmail: builder.query({
            query: (id) => ({
                url: `/${id}`,
                method: 'GET'
            }),
            providesTags: ['Order']
        }),
        getOrderById: builder.query({
            query: (orderId) => ({
                url: `/order/${orderId}`,
                method: 'GET'
            }),
            providesTags: ['Order']
        }),
        getAllOrders: builder.query({
            query: () => (
                {
                    url: '',
                    method: 'GET',  
                }
            ),
            providesTags: ['Order']
        }),
        updateOrderStatus: builder.mutation({
            query: ({id, status}) => ({
                url: `/update-order-status/${id}`,
                method: 'PATCH',
                body: { status },
            }),
            invalidatesTags: ['Order']
        }),
        deleteOrder: builder.mutation({
            query: (id) => ({
                url: `/delete-order/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Order']
        })
    })
})

export const {useCreateOrderMutation, useGetOrdersByEmailQuery, useGetOrderByIdQuery, useGetAllOrdersQuery, useUpdateOrderStatusMutation, useDeleteOrderMutation, } = orderApi;
export default orderApi;