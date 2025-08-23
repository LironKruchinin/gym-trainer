import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Trainee } from '../api/Trainee';

interface TraineesState {
  list: Trainee[];
}

const initialState: TraineesState = {
  list: [],
};

const traineesSlice = createSlice({
  name: 'trainees',
  initialState,
  reducers: {
    setTrainees(state, action: PayloadAction<Trainee[]>) {
      state.list = action.payload;
    },
    addTrainee(state, action: PayloadAction<Trainee>) {
      state.list.push(action.payload);
    },
  },
});

export const { setTrainees, addTrainee } = traineesSlice.actions;
export default traineesSlice.reducer;
