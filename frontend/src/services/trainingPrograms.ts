const sanitize = (v: string) => v.replace(/<[^>]*>?/gm, '').trim();

export interface Exercise {
    name: string;
    sets: string;
    reps: string;
    weight: string;
    rest: string;
}

export interface Program {
    id?: number;
    name: string;
    exercises: Exercise[];
    description?: string;
    difficultyLevel?: 'beginner' | 'intermediate' | 'advanced';
    workoutType?: string;
    isTemplate?: boolean;
}

export async function createProgram(program: Program) {
    const sanitized = {
        ...program,
        name: sanitize(program.name),
        description: program.description ? sanitize(program.description) : undefined,
        difficultyLevel: program.difficultyLevel ?? 'beginner',
        workoutType: sanitize(program.workoutType ?? 'general'),
        isTemplate: program.isTemplate ?? true,
        exercises: program.exercises.map((e) => ({
            name: sanitize(e.name),
            sets: Number(sanitize(e.sets)) || 1,
            reps: sanitize(e.reps),
            weight: sanitize(e.weight),
            rest: sanitize(e.rest),
        })),
    };
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    // build URL correctly whether apiUrl has a trailing slash or not
    const url = new URL('training-programs', apiUrl.endsWith('/') ? apiUrl : apiUrl + '/').toString();
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sanitized),
    });
    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Failed to save');
    }
    return res.json();
}

export async function getPrograms(): Promise<Program[]> {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const url = new URL('training-programs', apiUrl.endsWith('/') ? apiUrl : apiUrl + '/').toString();
    const res = await fetch(url);
    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Failed to load');
    }
    return res.json();
}

export async function deleteProgram(id: number): Promise<void> {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const url = new URL(`training-programs/${id}`, apiUrl.endsWith('/') ? apiUrl : apiUrl + '/').toString();
    const res = await fetch(url, { method: 'DELETE' });
    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Failed to delete');
    }
}
