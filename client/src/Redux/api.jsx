import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const token = JSON.parse(localStorage.getItem("UserToken"));

export const rootApi = createApi({
  reducerPath: "api",
  tagTypes: [],
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/user",
    prepareHeaders: (headers) => {
        headers.set('Authorization',token);
    },
  }),
  endpoints: (builder) => ({}),
});
