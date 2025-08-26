import { useGetTraineesQuery, useLogTrainingMutation } from '@store/slices/api/apiSlice';
import { useAppDispatch, addLog, setTrainees } from '@store';
import type { Trainee } from '@store/slices/api/Trainee';
import TrainingMonitorCube from '@components/layout/TrainingMonitorCube';
import { useEffect, useMemo } from 'react';

export default function TraineeScreens() {
    const { data: trainees = [] } = useGetTraineesQuery();
    const [logTraining] = useLogTrainingMutation();
    const dispatch = useAppDispatch();

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
                {sortedTrainees.map((t) => (
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

