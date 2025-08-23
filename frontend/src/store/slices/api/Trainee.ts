export interface Trainee {
    id: number;
    name: string;
    reservedTime: string;
    program?: { id: number; name: string } | null;
}
