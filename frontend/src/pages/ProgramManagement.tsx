import { faPen, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getPrograms,
    deleteProgram,
    type Program,
} from '../services/trainingPrograms';

export default function ProgramManagement() {
    const navigate = useNavigate();
    const [programs, setPrograms] = useState<Program[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getPrograms()
            .then(setPrograms)
            .catch((err) => {
                console.error(err);
                setError(err.message || 'Failed to load');
            });
    }, []);

    const removeProgram = async (id: number) => {
        try {
            await deleteProgram(id);
            setPrograms((prev) => prev.filter((p) => p.id !== id));
        } catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : 'Failed to delete';
            setError(message);
        }
    };

    const startEdit = (id?: number) => {
        navigate(id ? `/programs/${id}` : '/programs/new');
    };

    return (
        <div className="program-management container">
            <h1 className="program-management__title">מנהל תוכניות אימון</h1>
            <p className="program-management__subtitle">
                יצירה ועריכה של תוכניות אימון כלליות
            </p>
            {error && <p className="program-management__error">{error}</p>}
            {programs.length === 0 && !error && (
                <p className="program-management__empty">
                    אין תוכניות זמינות. צור רשומה חדשה כדי להתחיל.
                </p>
            )}
            <ul className="program-management__list">
                {programs.map((program) => (
                    <li key={program.id} className="program-management__item">
                        <span className="program-management__item-name">
                            {program.name}
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

