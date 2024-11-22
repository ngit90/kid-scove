import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../../utils/baseURL";
//import AddCategory from "../../../pages/dashboard/admin/addProduct/AddCategory";

const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/products`,
    credentials: "include",
  }),
  tagTypes: ["Products"],
  endpoints: (builder) => ({
    fetchAllProducts: builder.query({
      query: ({
        category,
        agegroup,
        minPrice,
        maxPrice,
        page = 1,
        limit = 10,
      }) => {
        const queryParams = new URLSearchParams({
          category: category || "",
          agegroup: agegroup || "",
          minPrice: minPrice || 0,
          maxPrice: maxPrice || "",
          page: page.toString(),
          limit: limit.toString(),
        }).toString();

        return `/?${queryParams}`;
      },
      providesTags: ["Products"],
    }),

    fetchProductById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),

    GetProducts: builder.query({
      query: () => ({
        url: "/list",
        method: "GET",
      }),
      refetchOnMountOrArgChange: true,
      providesTags: ["Products"],
    }),

    GetCategories: builder.query({
      query: () => ({
        url: "/categorylist",
        method: "GET",
      }),
      refetchOnMountOrArgChange: true,
      providesTags: ["Products"],
    }),

    AddProduct: builder.mutation({
      query: (newProduct) => ({
        url: "/create-product",
        method: "POST",
        body: newProduct,
        credentials: "include",
      }),
      invalidatesTags: ["Products"],
    }),

    AddCategory: builder.mutation({
      query: (newCategory) => ({
        url: "/create-category",
        method: "POST",
        body: newCategory,
        credentials: "include",
      }),
      invalidatesTags: ["Products"],
    }),

    ImageDelete: builder.mutation({
      query: (details) => ({
        url: "/deleteImage",
        method: "POST",
        body: details,
        credentials: "include",
      }),
      invalidatesTags: ["Products"],
    }),

    fetchRelatedProducts: builder.query({
      query: (id) => `/related/${id}`,
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `update-product/${id}`,
        method: "PATCH",
        body: rest,
        credentials: "include",
      }),
      invalidatesTags: ["Products"],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Products", id }],
    }),

    fetchCategoryById: builder.query({
      query: (id) => `category/${id}`,
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),
    
    updateCategory: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `update-category/${id}`,
        method: "PATCH",
        body: rest,
        credentials: "include",
      }),
      invalidatesTags: ["Products"],
    }),

    DeleteCategory: builder.mutation({
      query: (id) => ({
        url: `category/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Products", id }],
    }),
  }),
});

export const {useFetchAllProductsQuery, useFetchProductByIdQuery, useAddProductMutation,  useAddCategoryMutation,  useImageDeleteMutation, useUpdateProductMutation, useDeleteProductMutation, useFetchRelatedProductsQuery, useGetProductsQuery, useGetCategoriesQuery, useDeleteCategoryMutation, useFetchCategoryByIdQuery, useUpdateCategoryMutation} = productsApi;

export default productsApi;