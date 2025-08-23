const sanitize = (v: string) => v.replace(/<[^>]*>?/gm, '').trim();

export interface Exercise {
    name: string;
    sets: string;
    reps: string;
    weight: string;
    rest: string;
}

export interface Program {
    name: string;
    exercises: Exercise[];
    difficultyLevel?: 'beginner' | 'intermediate' | 'advanced';
    workoutType?: string;
}

export async function createProgram(program: Program) {
    const sanitized = {
        ...program,
        name: sanitize(program.name),
        difficultyLevel: program.difficultyLevel ?? 'beginner',
        workoutType: program.workoutType ?? 'general',
        exercises: program.exercises.map((e) => ({
            name: sanitize(e.name),
            sets: Number(sanitize(e.sets)) || 1,
            reps: sanitize(e.reps),
            weight: sanitize(e.weight),
            notes: sanitize(e.rest),
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
