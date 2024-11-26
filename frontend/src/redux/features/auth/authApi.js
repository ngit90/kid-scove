import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../../utils/baseURL";

const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/user`,
    credentials: "include",
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    sendOtp:builder.mutation({
      query: (useremail) => ({
        url: "/send-otp",
        method: "POST",
        body: useremail,
      }),
    }),
    verifyOtp: builder.mutation({
      query: (newUser) => ({
        url: "/verify-otp",
        method: "POST",
        body: newUser,
      }),
    }),
    sendPassOtp:builder.mutation({
      query: (useremail) => ({
        url: "/sendpass-otp",
        method: "POST",
        body: useremail,
      }),
    }),
    forgotPass: builder.mutation({
      query: (newUser) => ({
        url: "/forgotpass",
        method: "POST",
        body: newUser,
      }),
    }),
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
    getUser: builder.query({
      query: () => ({
        url: "/users",
        method: "GET",
      }),
      refetchOnMount: true,
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation({
        query: (userId) => ({
            url: `/users/${userId}`,
            method: "DELETE",
        }),
        invalidatesTags: ["User"],
    }),
    updateUser: builder.mutation({
        query: ({userId, role, status}) => ({
            url: `/users/${userId}`,
            method: "PUT",
            body: {role, status}
          }),
          refetchOnMount: true,
          invalidatesTags: ["User"],
    }),
    editProfile: builder.mutation({
        query: (profileData) => ({
            url: `/edit-profile`,
            method: "PATCH",
            body: profileData
          }),
          invalidatesTags: ["User"], // Add this to update cached user data
    }),
  }),
});

export const { useVerifyOtpMutation, useSendOtpMutation, useSendPassOtpMutation, useForgotPassMutation, useLoginUserMutation, useLogoutUserMutation, useGetUserQuery, useDeleteUserMutation, useUpdateUserMutation, useEditProfileMutation } = authApi;
export default authApi;
