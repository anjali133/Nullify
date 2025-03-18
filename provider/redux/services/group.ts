import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const groupApi = createApi({
  reducerPath: "groupApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),
  tagTypes: ["GetGroups", "GroupExpense"],
  endpoints: (builder) => ({
    createGroup: builder.mutation({
      query: (payload) => ({
        url: `group`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["GetGroups"],
    }),
    fetchGroup: builder.query({
      query: (userId?: string) => ({
        url: `/group/user/${userId}`,
        method: "GET",
      }),
      providesTags: ["GetGroups"],
    }),
    fetchSingleGroup: builder.query({
      query: (groupId: number) => ({
        url: `/group/${groupId}`,
        method: "GET",
      }),
      providesTags: ["GroupExpense"],
    }),
    createGroupExpense: builder.mutation({
      query: (expenseData) => ({
        url: `group-expense`,
        method: "POST",
        body: expenseData,
      }),
      invalidatesTags: ["GroupExpense"],
    }),
    fetchGroupExpense: builder.query({
      query: (groupId: number) => ({
        url: `/group-expense/${groupId}`,
        method: "GET",
      }),
      providesTags: ["GroupExpense"],
    }),
  }),
});

export const {
  useCreateGroupMutation,
  useFetchGroupQuery,
  useCreateGroupExpenseMutation,
  useFetchSingleGroupQuery,
  useFetchGroupExpenseQuery,
} = groupApi;
