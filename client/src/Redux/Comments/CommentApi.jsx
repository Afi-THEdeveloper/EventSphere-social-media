import { rootApi } from "../api";

export const commentsApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchComments: builder.query({
      query: (postId) => `/comments/${postId}/comments`,
      providesTags: ["Comment"],
    }),
    addComment: builder.mutation({
      query: ({ postId, data }) => ({
        url: `/comments/${postId}/createComment`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Comment"],
    }),

    addReply: builder.mutation({
      query: ({ commentId, data }) => ({
        url: `/comments/${commentId}/reply`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Comment"],
    }),
    deleteReply: builder.mutation({
      query: ({ commentId, replyId }) => ({
        url: `/comments/${commentId}/replies/${replyId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Comment"],
    }),
  }),
});

export const { useAddCommentMutation,useFetchCommentsQuery,useAddReplyMutation,useDeleteReplyMutation } = commentsApi;
