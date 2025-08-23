// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';

// — import your slices here —
import countReducer from './slices/count/countSlice';
import { api } from './slices/api/apiSlice';
import trainingLogsReducer from './slices/trainingLogs/trainingLogsSlice';
// import userReducer from './slices/user/userSlice';

export const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        count: countReducer,
        trainingLogs: trainingLogsReducer,
        // user: userReducer,
    },
    middleware: (getDefault) =>
        getDefault().concat(api.middleware),   // add the RTK Query middleware
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks for use throughout your app:
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Re-export actions/types for easy imports elsewhere:
export * from './slices/count/countSlice';
export * from './slices/user/userSlice';
export * from './slices/trainingLogs/trainingLogsSlice';
