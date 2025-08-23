import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Post } from './Post';

// 1️⃣ Define your “base” config
export const api = createApi({
    reducerPath: 'api',                         // unique key in the store
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,    // e.g. 'http://localhost:4000'
        prepareHeaders(headers) {
            // if you have auth tokens:
            // const token = localStorage.getItem('token');
            // if (token) headers.set('authorization', `Bearer ${token}`);
            return headers;
        },
    }),
    tagTypes: ['Post'],                         // for cache invalidation
    endpoints: (build) => ({
        // 2️⃣ A “getPosts” endpoint
        getPosts: build.query<Post[], void>({
            query: () => '/posts',
            providesTags: (result) =>
                result
                    ? [...result.map(({ id }) => ({ type: 'Post' as const, id })), { type: 'Post', id: 'LIST' }]
                    : [{ type: 'Post', id: 'LIST' }],
        }),
        // 3️⃣ A “addPost” mutation
        addPost: build.mutation<Post, Partial<Post>>({
            query: (newPost) => ({
                url: '/posts',
                method: 'POST',
                body: newPost,
            }),
            invalidatesTags: [{ type: 'Post', id: 'LIST' }],
        }),
    }),
});

// 4️⃣ Export auto-generated hooks
export const { useGetPostsQuery, useAddPostMutation } = api;
