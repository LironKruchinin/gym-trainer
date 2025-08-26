import { useGetTraineesQuery, useLogTrainingMutation } from '@store/slices/api/apiSlice';
import { useAppDispatch, addLog, setTrainees } from '@store';
import type { Trainee } from '@store/slices/api/Trainee';
import TrainingMonitorCube from '@components/layout/TrainingMonitorCube';
import { useEffect, useMemo, useState } from 'react';

interface Exercise {
    name: string;
    sets: string;
    weight: string;
    rest: string;
}

interface LocalProgram {
    id: number;
    traineeName: string;
    programName: string;
    exercises: Exercise[];
}

export default function TraineeScreens() {
    const { data: trainees = [] } = useGetTraineesQuery();
    const [logTraining] = useLogTrainingMutation();
    const dispatch = useAppDispatch();
    const [localPrograms, setLocalPrograms] = useState<LocalProgram[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('programs');
        if (stored) {
            try {
                setLocalPrograms(JSON.parse(stored) as LocalProgram[]);
            } catch {
                setLocalPrograms([]);
            }
        }
    }, []);

    const sortedTrainees = useMemo(
        () =>
            [...trainees].sort(
                (a, b) => new Date(a.reservedTime).getTime() - new Date(b.reservedTime).getTime()
            ),
        [trainees]
    );

    useEffect(() => {
        dispatch(setTrainees(sortedTrainees));
    }, [sortedTrainees, dispatch]);

    const useLocal = (!sortedTrainees || sortedTrainees.length === 0) && localPrograms.length > 0;

    const completeTraining = (trainee: Trainee) => {
        if (!trainee.program) return;
        logTraining({
            traineeId: trainee.id,
            programId: trainee.program.id,
            details: {},
        });
        dispatch(
            addLog({
                traineeId: trainee.id,
                entry: {
                    programId: trainee.program.id,
                    details: {},
                    completedAt: new Date().toISOString(),
                },
            }),
        );
    };

    return (
        <div className="trainee-screens container">
            <h1 className="trainee-screens__title">מוניטור אימונים</h1>
            <div className="trainee-screens__grid">
                {useLocal &&
                    localPrograms.map((program) => (
                        <TrainingMonitorCube
                            key={program.id}
                            traineeName={program.traineeName}
                            programName={program.programName}
                            exercises={program.exercises}
                        />
                    ))}

                {!useLocal &&
                    sortedTrainees.map((t) => (
                        <div key={t.id} className="trainee-card">
                            <TrainingMonitorCube
                                traineeName={t.name}
                                programName={t.program?.name}
                                exercises={t.program?.exercises || []}
                            />
                            {t.program && (
                                <button
                                    className="trainee-card__complete"
                                    onClick={() => completeTraining(t)}
                                >
                                    סיים אימון
                                </button>
                            )}
                        </div>
                    ))}
            </div>
        </div>
    );
}

