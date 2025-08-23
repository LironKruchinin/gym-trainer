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
            const apiUrl = "http://localhost:3001";
            if (!apiUrl) {
                console.error('VITE_API_URL is missing');
                return;
            }

            // builds `${apiUrl}/exercises` correctly whether or not apiUrl has a trailing slash
            const url = new URL('exercises', apiUrl.endsWith('/') ? apiUrl : apiUrl + '/').toString();

            try {
                const res = await fetch(url, {
                    headers: { Accept: 'application/json' },
                    credentials: 'include', // keep if your API uses cookies/sessions; otherwise remove
                });

                if (!res.ok) {
                    const text = await res.text().catch(() => '');
                    throw new Error(`HTTP ${res.status} – ${res.statusText}\n${text.slice(0, 500)}`);
                }

                const ct = res.headers.get('content-type') || '';
                if (!ct.includes('application/json')) {
                    const text = await res.text();
                    throw new Error(
                        `Expected JSON but got "${ct || 'unknown'}". Body preview:\n${text.slice(0, 500)}`
                    );
                }

                const data: Array<{ name?: string | null }> = await res.json();
                const names = (data || []).map((e) => sanitize(e?.name)).filter(Boolean) as string[];
                setOptions(names);
            } catch (err) {
                console.error('Failed to load exercises:', err);
                setOptions([]); // fail safe
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
