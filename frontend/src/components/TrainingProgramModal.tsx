import { useEffect, useState } from 'react';

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
                <button onClick={onClose}>סגור</button>
            </div>
            <div className="training-program-modal__controls">
                <button className="training-program-modal__reschedule">העבר תור</button>
                <input
                    className="training-program-modal__input"
                    list="training-options"
                    value={selection}
                    onChange={(e) => setSelection(e.target.value)}
                    placeholder="בחר סוג אימון"
                />
                <datalist id="training-options">
                    {trainingOptions.map((opt) => (
                        <option key={opt} value={opt} />
                    ))}
                </datalist>
            </div>
            <ul className="training-program-modal__list">
                {programs.map((p) => (
                    <li key={p.id} className="training-program-modal__item">
                        <span>{p.name}</span>
                        <div className="training-program-modal__item-actions">
                            <button>בחר</button>
                            <button>העבר זמן</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
