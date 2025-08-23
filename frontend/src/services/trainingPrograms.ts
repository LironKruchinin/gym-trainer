const sanitize = (v: string) => v.replace(/<[^>]*>?/gm, '').trim();

export interface Exercise {
    name: string;
    sets: string;
    weight: string;
    rest: string;
}

export interface Program {
    name: string;
    exercises: Exercise[];
}

export async function createProgram(program: Program) {
    const sanitized = {
        ...program,
        name: sanitize(program.name),
        exercises: program.exercises.map((e) => ({
            name: sanitize(e.name),
            sets: sanitize(e.sets),
            weight: sanitize(e.weight),
            rest: sanitize(e.rest),
        })),
    };
    const res = await fetch('/api/training-programs', {
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
