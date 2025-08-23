import ProgressBar from '@components/ui/ProgressBar';
import { useEffect, useState } from 'react';

interface Exercise {
    name: string;
    sets: string;
    weight: string;
    rest: string;
}

interface Program {
    id: number;
    traineeName: string;
    exercises: Exercise[];
}

export default function TraineeScreens() {
    const [programs, setPrograms] = useState<Program[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('programs');
        if (stored) {
            setPrograms(JSON.parse(stored));
        }
    }, []);

    return (
        <div className="trainee-screens container">
            <h1 className="trainee-screens__title">מוניטור אימונים</h1>
            <div className="trainee-screens__grid">
                {programs.map((program) => (
                    <div key={program.id} className="trainee-card">
                        <div className="trainee-card__header">
                            <h2 className="trainee-card__name">{program.traineeName}</h2>
                            <span className="trainee-card__progress-label">
                                0/{program.exercises.length}
                            </span>
                        </div>
                        <ProgressBar
                            value={0}
                            max={program.exercises.length}
                            className="trainee-card__progress"
                        />
                        <ul className="trainee-card__exercises">
                            {program.exercises.map((ex, idx) => (
                                <li key={idx} className="trainee-card__exercise">
                                    <span className="trainee-card__exercise-name">{ex.name}</span>
                                    <span className="trainee-card__exercise-details">
                                        {ex.sets} סטים | {ex.weight} | {ex.rest}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}
