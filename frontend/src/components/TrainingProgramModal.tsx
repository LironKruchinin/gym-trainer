import { useEffect, useState } from 'react';
import SearchableSelect from './ui/SearchableSelect';

interface Program {
    id: number;
    name: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function TrainingProgramModal({ isOpen, onClose }: Props) {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [selection, setSelection] = useState('');
    const trainingOptions = ['כוח', 'קרדיו', 'גמישות'];

    useEffect(() => {
        if (isOpen) {
            const stored = localStorage.getItem('programs');
            if (stored) setPrograms(JSON.parse(stored));
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="training-program-modal">
            <div className="training-program-modal__header">
                <h2>תוכניות אימון</h2>
                <button className="btn btn--error" onClick={onClose}>סגור</button>
            </div>
            <div className="training-program-modal__controls">
                <button className="btn btn--warning training-program-modal__reschedule">העבר תור</button>
                <SearchableSelect
                    options={trainingOptions}
                    value={selection}
                    onChange={setSelection}
                    placeholder="בחר סוג אימון"
                    inputClassName="training-program-modal__input"
                />
            </div>
            <ul className="training-program-modal__list">
                {programs.map((p) => (
                    <li key={p.id} className="training-program-modal__item">
                        <span>{p.name}</span>
                        <div className="training-program-modal__item-actions">
                            <button className="btn btn--success">בחר</button>
                            <button className="btn btn--warning">העבר זמן</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
