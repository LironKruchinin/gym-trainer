import ProgressBar from '@components/ui/ProgressBar';
import { useEffect, useState } from 'react';

import { useGetTraineesQuery, useLogTrainingMutation } from '@store/slices/api/apiSlice';
import { useAppDispatch, addLog } from '@store';
import type { Trainee } from '@store/slices/api/Trainee';

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

export default function TraineeScreens() {
  // ---- Primary source: API (RTK Query)
  const { data: trainees = [] } = useGetTraineesQuery();
  const [logTraining] = useLogTrainingMutation();
  const dispatch = useAppDispatch();

  // ---- Fallback source: localStorage
  const [programs, setPrograms] = useState<LocalProgram[]>([]);
  useEffect(() => {
    const stored = localStorage.getItem('programs');
    if (stored) setPrograms(JSON.parse(stored));
  }, []);

  const useLocal = (!trainees || trainees.length === 0) && programs.length > 0;

  const completeTraining = (trainee: Trainee) => {
    if (!trainee?.program) return;
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
      })
    );
  };

  return (
    <div className="trainee-screens container">
      <h1 className="trainee-screens__title">מוניטור אימונים</h1>

      <div className="trainee-screens__grid">
        {/* ---- Local fallback view ---- */}
        {useLocal &&
          programs.map((program) => (
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

        {/* ---- API-driven view ---- */}
        {!useLocal &&
          trainees.map((t) => (
            <div key={t.id} className="trainee-card">
              <div className="trainee-card__header">
                <h2 className="trainee-card__name">{t.name}</h2>
                {t.reservedTime && (
                  <span className="trainee-card__time">
                    {new Date(t.reservedTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                )}
              </div>

              {/* Optional progress if exercises exist on API program */}
              {t.program?.exercises?.length ? (
                <>
                  <span className="trainee-card__progress-label">
                    0/{t.program.exercises.length}
                  </span>
                  <ProgressBar
                    value={0}
                    max={t.program.exercises.length}
                    className="trainee-card__progress"
                  />
                  <ul className="trainee-card__exercises">
                    {t.program.exercises.map((ex: any, idx: number) => (
                      <li key={idx} className="trainee-card__exercise">
                        <span className="trainee-card__exercise-name">{ex.name}</span>
                        <span className="trainee-card__exercise-details">
                          {ex.sets} סטים {ex.weight ? `| ${ex.weight}` : ''}{' '}
                          {ex.rest ? `| ${ex.rest}` : ''}
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}

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
