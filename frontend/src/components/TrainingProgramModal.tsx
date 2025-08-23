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
