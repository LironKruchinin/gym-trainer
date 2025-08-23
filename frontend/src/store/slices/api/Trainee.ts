export interface ProgramExercise {
    name: string;
    sets: number;
    reps: string;
    weight: string;
    rest?: string;
}

export interface TrainingProgram {
    id: number;
    name: string;
    exercises?: ProgramExercise[];
}

export interface Trainee {
    id: number;
    name: string;
    reservedTime: string;
    program?: TrainingProgram | null;
}