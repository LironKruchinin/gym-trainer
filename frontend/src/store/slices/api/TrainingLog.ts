export interface TrainingLog {
    id: number;
    trainee: { id: number; name: string };
    program: { id: number; name: string };
    details?: Record<string, unknown>;
    completedAt: string;
}
