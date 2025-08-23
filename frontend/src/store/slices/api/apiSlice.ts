import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Post } from './Post';
import type { Trainee } from './Trainee';
import type { TrainingLog } from './TrainingLog';
import type { Exercise } from './Exercise';

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
    tagTypes: ['Post', 'Trainee', 'TrainingLog', 'Exercise'],                         // for cache invalidation
    endpoints: (build) => ({
        getPosts: build.query<Post[], void>({
            query: () => '/posts',
            providesTags: (result) =>
                result
                    ? [...result.map(({ id }) => ({ type: 'Post' as const, id })), { type: 'Post', id: 'LIST' }]
                    : [{ type: 'Post', id: 'LIST' }],
        }),
        addPost: build.mutation<Post, Partial<Post>>({
            query: (newPost) => ({
                url: '/posts',
                method: 'POST',
                body: newPost,
            }),
            invalidatesTags: [{ type: 'Post', id: 'LIST' }],
        }),
        getTrainees: build.query<Trainee[], void>({
            query: () => '/trainees',
            providesTags: (result) =>
                result
                    ? [
                          ...result.map(({ id }) => ({ type: 'Trainee' as const, id })),
                          { type: 'Trainee', id: 'LIST' },
                      ]
                    : [{ type: 'Trainee', id: 'LIST' }],
        }),
        syncTrainees: build.mutation<Trainee[], void>({
            query: () => ({ url: '/trainees/sync', method: 'POST' }),
            invalidatesTags: [{ type: 'Trainee', id: 'LIST' }],
        }),
        assignProgram: build.mutation<
            Trainee,
            { id: number; programId: number }
        >({
            query: ({ id, programId }) => ({
                url: `/trainees/${id}/program`,
                method: 'PATCH',
                body: { programId },
            }),
            invalidatesTags: (res, err, { id }) => [{ type: 'Trainee', id }],
        }),
        logTraining: build.mutation<
            TrainingLog,
            {
                traineeId: number;
                programId: number;
                details?: Record<string, unknown>;
            }
        >({
            query: (body) => ({ url: '/training-logs', method: 'POST', body }),
            invalidatesTags: [{ type: 'TrainingLog', id: 'LIST' }],
        }),
        getExercises: build.query<Exercise[], void>({
            query: () => '/exercises',
            providesTags: (result) =>
                result
                    ? [
                          ...result.map(({ id }) => ({ type: 'Exercise' as const, id })),
                          { type: 'Exercise', id: 'LIST' },
                      ]
                    : [{ type: 'Exercise', id: 'LIST' }],
        }),
        syncExercises: build.mutation<Exercise[], void>({
            query: () => ({ url: '/exercises/sync', method: 'POST' }),
            invalidatesTags: [{ type: 'Exercise', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetPostsQuery,
    useAddPostMutation,
    useGetTraineesQuery,
    useSyncTraineesMutation,
    useAssignProgramMutation,
    useLogTrainingMutation,
    useGetExercisesQuery,
    useSyncExercisesMutation,
} = api;
