// store/slices/count/countSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../index';

// Define the slice state type
interface CountState {
    value: number;
}

// Initial state
const initialState: CountState = {
    value: 0,
};

export const countSlice = createSlice({
    name: 'count',
    initialState,
    reducers: {
        // Increment by 1
        increment(state) {
            state.value += 1;
        },
        // Decrement by 1
        decrement(state) {
            state.value -= 1;
        },
        // Increment by a specific amount (payload)
        incrementByAmount(state, action: PayloadAction<number>) {
            state.value += action.payload;
        },
        // Reset to zero
        reset(state) {
            state.value = 0;
        },
    },
});

// Export actions
export const { increment, decrement, incrementByAmount, reset } = countSlice.actions;

// Selector to get the current count value
export const selectCount = (state: RootState) => state.count.value;

// Export the reducer to be registered in store/index.ts
export default countSlice.reducer;
