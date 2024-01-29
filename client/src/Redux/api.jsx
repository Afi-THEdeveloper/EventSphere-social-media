import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../config/api";

const token = JSON.parse(localStorage.getItem("UserToken"));

export const rootApi = createApi({
  reducerPath: "api",
  tagTypes: [],
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/api/user`,
    prepareHeaders: (headers) => {
        headers.set('Authorization',token);
    },
  }),
  endpoints: (builder) => ({}),
});
