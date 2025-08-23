import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ExerciseSelector from '../components/ExerciseSelector';
import { createProgram, type Program } from '../services/trainingPrograms';

interface Exercise {
    name: string;
    sets: string;
    weight: string;
    rest: string;
}

interface LocalProgram extends Program {
    id?: number;
}

const sanitize = (v: string) => v.replace(/<[^>]*>?/gm, '');

export default function ProgramEdit() {
    const navigate = useNavigate();
    const params = useParams();
    const id = params.id ? Number(sanitize(params.id)) : undefined;
    const [program, setProgram] = useState<LocalProgram>({
        name: '',
        exercises: [{ name: '', sets: '', weight: '', rest: '' }],
    });

    useEffect(() => {
        // placeholder for future loading of existing programs from the backend
    }, [id]);

    const updateExercise = (index: number, field: keyof Exercise, value: string) => {
        const updated = [...program.exercises];
        updated[index] = { ...updated[index], [field]: sanitize(value) };
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

    const saveProgram = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createProgram({ name: sanitize(program.name), exercises: program.exercises });
            navigate('/programs');
        } catch (err) {
            console.error(err);
            alert('שמירת התוכנית נכשלה');
        }
    };

    return (
        <div className="program-edit container">
            <h1 className="program-edit__title">עריכת תוכנית אימונים עבור {program.name || 'תוכנית חדשה'}</h1>
            <form className="program-edit__form" onSubmit={saveProgram}>
                <label className="program-edit__field">
                    <span className="program-edit__label">שם התוכנית</span>
                    <input
                        className="program-edit__input"
                        value={program.name}
                        onChange={(e) => setProgram({ ...program, name: sanitize(e.target.value) })}
                        required
                    />
                </label>

                {(program.exercises || []).map((exercise, idx) => (
                    <div key={idx} className="program-edit__exercise">
                        <label className="program-edit__field">
                            <span className="program-edit__label">שם התרגיל</span>
                            <ExerciseSelector
                                value={exercise.name}
                                onChange={(val) => updateExercise(idx, 'name', val)}
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
                    <button type="button" className="program-edit__cancel" onClick={() => navigate('/programs')}>ביטול</button>
                    <button type="submit" className="program-edit__save">שמור</button>
                </div>
            </form>
        </div>
    );
}

