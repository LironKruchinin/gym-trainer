import {
    useGetTraineesQuery,
    useLogTrainingMutation,
    useSyncTraineesMutation,
} from '@store/slices/api/apiSlice';
import { useAppDispatch, addLog, setTrainees } from '@store';
import type { Trainee } from '@store/slices/api/Trainee';
import TrainingMonitorCube from '@components/layout/TrainingMonitorCube';
import { useEffect } from 'react';

interface Exercise {
    name: string;
    sets: string;
    weight: string;
    rest: string;
}

interface LocalProgram {
    id: number;
    traineeName: string;
    exercises: Exercise[];
}

const localPrograms: LocalProgram[] = [
    {
        id: 1,
        traineeName: "ג'ון סמות",
        exercises: [
            { name: 'סקוואט', sets: '3', weight: '50kg', rest: '60s' },
            { name: 'לחיצת חזה', sets: '3', weight: '40kg', rest: '60s' },
            { name: 'חתירה', sets: '3', weight: '30kg', rest: '60s' },
        ],
    },
    {
        id: 2,
        traineeName: 'דנה לוי',
        exercises: [
            { name: 'מכרעים', sets: '3', weight: '20kg', rest: '60s' },
            { name: 'מתח', sets: '3', weight: 'משקל גוף', rest: '60s' },
            { name: 'בטן', sets: '3', weight: '', rest: '60s' },
        ],
    },
];

export default function TraineeScreens() {
    const { data: trainees = [] } = useGetTraineesQuery();
    const [logTraining] = useLogTrainingMutation();
    const [syncTrainees] = useSyncTraineesMutation();
    const dispatch = useAppDispatch();

    useEffect(() => {
        localStorage.setItem('programs', JSON.stringify(localPrograms));
        syncTrainees();
    }, [syncTrainees]);

    useEffect(() => {
        dispatch(setTrainees(trainees));
    }, [trainees, dispatch]);

    const useLocal = (!trainees || trainees.length === 0) && localPrograms.length > 0;

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
                            programName=""
                            exercises={program.exercises}
                        />
                    ))}

                {!useLocal &&
                    trainees.map((t) => (
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

