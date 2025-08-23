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
