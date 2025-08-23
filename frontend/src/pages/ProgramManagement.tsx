import { faPen, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Program {
    id: number;
    traineeName: string;
}

const seedPrograms: Program[] = [
    { id: 1, traineeName: 'ג\'ן סמיתי' },
    { id: 2, traineeName: 'שרה ג\'ונסון' },
    { id: 3, traineeName: 'מייק וילסון' },
];

export default function ProgramManagement() {
    const navigate = useNavigate();
    const [programs, setPrograms] = useState<Program[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('programs');
        if (stored) {
            setPrograms(JSON.parse(stored));
        } else {
            localStorage.setItem('programs', JSON.stringify(seedPrograms));
            setPrograms(seedPrograms);
        }
    }, []);

    const removeProgram = (id: number) => {
        const updated = programs.filter((p) => p.id !== id);
        setPrograms(updated);
        localStorage.setItem('programs', JSON.stringify(updated));
    };

    const startEdit = (id?: number) => {
        navigate(id ? `/programs/${id}` : '/programs/new');
    };

    return (
        <div className="program-management container">
            <h1 className="program-management__title">מנהל תוכניות אימונים</h1>
            <p className="program-management__subtitle">
                יצירה ועריכה של תוכניות אימון למתאמנים
            </p>

            <ul className="program-management__list">
                {programs.map((program) => (
                    <li key={program.id} className="program-management__item">
                        <span className="program-management__item-name">
                            {program.traineeName}
                        </span>
                        <div className="program-management__item-actions">
                            <button
                                className="program-management__btn program-management__btn--edit"
                                onClick={() => startEdit(program.id)}
                            >
                                <FontAwesomeIcon icon={faPen} />
                                <span>עריכה</span>
                            </button>
                            <button
                                className="program-management__btn program-management__btn--delete"
                                onClick={() => removeProgram(program.id)}
                            >
                                <FontAwesomeIcon icon={faTrash} />
                                <span>מחיקה</span>
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            <button
                className="program-management__add"
                onClick={() => startEdit()}
            >
                <FontAwesomeIcon icon={faPlus} />
                <span>הוסף תוכנית אימון חדשה</span>

            </button>
        </div>
    );
}