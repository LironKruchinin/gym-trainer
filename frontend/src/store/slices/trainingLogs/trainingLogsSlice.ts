import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface TrainingEntry {
    programId: number;
    details: Record<string, unknown>;
    completedAt: string;
}

interface TrainingLogsState {
    [traineeId: string]: TrainingEntry[];
}

const initialState: TrainingLogsState = {};

const trainingLogsSlice = createSlice({
    name: 'trainingLogs',
    initialState,
    reducers: {
        addLog: (
            state,
            action: PayloadAction<{ traineeId: number; entry: TrainingEntry }>,
        ) => {
            const { traineeId, entry } = action.payload;
            const key = String(traineeId);
            if (!state[key]) state[key] = [];
            state[key].push(entry);
        },
    },
});

export const { addLog } = trainingLogsSlice.actions;
export default trainingLogsSlice.reducer;
