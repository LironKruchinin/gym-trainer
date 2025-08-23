import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Exercise {
    name: string;
    sets: string;
    weight: string;
    rest: string;
}

interface Program {
    id?: number;
    traineeName: string;
    exercises: Exercise[];
}

export default function ProgramEdit() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [program, setProgram] = useState<Program>({
        traineeName: '',
        exercises: [
            { name: '', sets: '', weight: '', rest: '' },
        ],
    });

    useEffect(() => {
        if (id) {
            const stored = localStorage.getItem('programs');
            if (stored) {
                const programs: Program[] = JSON.parse(stored);
                const existing = programs.find((p) => p.id === Number(id));
                if (existing) {
                    setProgram(existing);
                }
            }
        }
    }, [id]);

    const updateExercise = (index: number, field: keyof Exercise, value: string) => {
        const updated = [...program.exercises];
        updated[index] = { ...updated[index], [field]: value };
        setProgram({ ...program, exercises: updated });
    };

    const addExercise = () => {
        setProgram({
            ...program,
            exercises: [...program.exercises, { name: '', sets: '', weight: '', rest: '' }],
        });
    };

    const removeExercise = (index: number) => {
        const updated = program.exercises.filter((_, i) => i !== index);
        setProgram({ ...program, exercises: updated });
    };

    const saveProgram = (e: React.FormEvent) => {
        e.preventDefault();
        const stored = localStorage.getItem('programs');
        const programs: Program[] = stored ? JSON.parse(stored) : [];
        let updated: Program[];
        if (id) {
            updated = programs.map((p) => (p.id === Number(id) ? { ...program, id: Number(id) } : p));
        } else {
            const newProgram = { ...program, id: Date.now() };
            updated = [...programs, newProgram];
        }
        localStorage.setItem('programs', JSON.stringify(updated));
        navigate('/programs');
    };

    return (
        <div className="program-edit container">
            <h1 className="program-edit__title">עריכת תוכנית אימונים עבור {program.traineeName || 'מתאמן'}</h1>
            <form className="program-edit__form" onSubmit={saveProgram}>
                <label className="program-edit__field">
                    <span className="program-edit__label">שם המתאמן</span>
                    <input
                        className="program-edit__input"
                        value={program.traineeName}
                        onChange={(e) => setProgram({ ...program, traineeName: e.target.value })}
                        required
                    />
                </label>

                {program.exercises.map((exercise, idx) => (
                    <div key={idx} className="program-edit__exercise">
                        <label className="program-edit__field">
                            <span className="program-edit__label">שם התרגיל</span>
                            <input
                                className="program-edit__input"
                                value={exercise.name}
                                onChange={(e) => updateExercise(idx, 'name', e.target.value)}
                                required
                            />
                        </label>
                        <label className="program-edit__field">
                            <span className="program-edit__label">מספר חזרות</span>
                            <input
                                className="program-edit__input"
                                value={exercise.sets}
                                onChange={(e) => updateExercise(idx, 'sets', e.target.value)}
                            />
                        </label>
                        <label className="program-edit__field">
                            <span className="program-edit__label">משקל</span>
                            <input
                                className="program-edit__input"
                                value={exercise.weight}
                                onChange={(e) => updateExercise(idx, 'weight', e.target.value)}
                            />
                        </label>
                        <label className="program-edit__field">
                            <span className="program-edit__label">מנוחה</span>
                            <input
                                className="program-edit__input"
                                value={exercise.rest}
                                onChange={(e) => updateExercise(idx, 'rest', e.target.value)}
                            />
                        </label>
                        <button
                            type="button"
                            className="program-edit__delete-exercise"
                            onClick={() => removeExercise(idx)}
                        >
                            <FontAwesomeIcon icon={faTrash} /> מחיקה
                        </button>
                    </div>
                ))}

                <button
                    type="button"
                    className="program-edit__add-exercise"
                    onClick={addExercise}
                >
                    <FontAwesomeIcon icon={faPlus} /> הוסף תרגיל
                </button>

                <div className="program-edit__actions">
                    <button type="submit" className="program-edit__save">שמור</button>
                </div>
            </form>
        </div>
    );
}
