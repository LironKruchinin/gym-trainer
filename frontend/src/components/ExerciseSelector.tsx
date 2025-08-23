import { useEffect, useState } from 'react';
import SearchableSelect from './ui/SearchableSelect';

interface Props {
    value: string;
    onChange: (val: string) => void;
}

const sanitize = (v: string) => v.replace(/<[^>]*>?/gm, '').trim();

export default function ExerciseSelector({ value, onChange }: Props) {
    const [options, setOptions] = useState<string[]>([]);

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const res = await fetch(
                    'https://wger.de/api/v2/exercise/?language=21&limit=2000'
                );
                const data = await res.json();
                const names = (data.results || []).map((e: any) => sanitize(e.name));
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
