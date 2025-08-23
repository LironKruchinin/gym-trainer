import { useGetTraineesQuery, useLogTrainingMutation } from '@store/slices/api/apiSlice';
import { useAppDispatch, addLog } from '@store';
import type { Trainee } from '@store/slices/api/Trainee';

export default function TraineeScreens() {
    const { data: trainees = [] } = useGetTraineesQuery();
    const [logTraining] = useLogTrainingMutation();
    const dispatch = useAppDispatch();

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
                {trainees.map((t) => (
                    <div key={t.id} className="trainee-card">
                        <div className="trainee-card__header">
                            <h2 className="trainee-card__name">{t.name}</h2>
                            <span className="trainee-card__time">
                                {new Date(t.reservedTime).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </span>
                        </div>
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
