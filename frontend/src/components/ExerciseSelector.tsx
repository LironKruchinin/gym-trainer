import { useEffect, useState } from 'react';
import SearchableSelect from './ui/SearchableSelect';

interface Props {
    value: string;
    onChange: (val: string) => void;
}

const sanitize = (v?: string | null) => (v ?? '').replace(/<[^>]*>?/gm, '').trim();

export default function ExerciseSelector({ value, onChange }: Props) {
    const [options, setOptions] = useState<string[]>([]);

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const res = await fetch('/api/exercises');
                if (!res.ok) {
                    throw new Error(`unexpected status ${res.status}`);
                }
                const contentType = res.headers.get('content-type') ?? '';
                if (!contentType.includes('application/json')) {
                    throw new Error(`expected JSON, got ${contentType}`);
                }
                const data: Array<{ name?: string }> = await res.json();
                const names = (data || [])
                    .map((e) => sanitize(e.name))
                    .filter(Boolean);
                setOptions(names);
            } catch (err) {
                console.error('Failed to load exercises', err);
            }
        };
        fetchExercises();
    }, []);

    return (
        <SearchableSelect
            options={options}
            value={value}
            onChange={(val) => onChange(sanitize(val))}
            inputClassName="program-edit__input"
        />
    );
}
