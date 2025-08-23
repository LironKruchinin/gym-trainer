import { useState } from 'react';

interface Props {
    options: string[];
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    inputClassName?: string;
}

export default function SearchableSelect({ options, value, onChange, placeholder, inputClassName }: Props) {
    const [open, setOpen] = useState(false);
    const filtered = options.filter((opt) => opt.toLowerCase().includes(value.toLowerCase()));

    const handleSelect = (opt: string) => {
        onChange(opt);
        setOpen(false);
    };

    return (
        <div className="searchable-select">
            <input
                className={`searchable-select__input ${inputClassName ?? ''}`.trim()}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setOpen(true)}
                onBlur={() => {
                    setTimeout(() => setOpen(false), 100);
                }}
            />
            {open && filtered.length > 0 && (
                <ul className="searchable-select__list">
                    {filtered.map((opt) => (
                        <li
                            key={opt}
                            className="searchable-select__option"
                            onMouseDown={() => handleSelect(opt)}
                        >
                            {opt}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
