import { exercises } from '../data/exercises';

interface Props {
    value: string;
    onChange: (val: string) => void;
}

export default function ExerciseSelector({ value, onChange }: Props) {
    return (
        <div className="exercise-selector">
            <input
                list="exercise-options"
                className="program-edit__input"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            <datalist id="exercise-options">
                {exercises.map((ex) => (
                    <option key={ex} value={ex} />
                ))}
            </datalist>
        </div>
    );
}
