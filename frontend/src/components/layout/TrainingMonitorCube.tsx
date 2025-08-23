import React from 'react';
import ExerciseList from './ExerciseList';
import ProgressBar from '../ui/ProgressBar';

interface Exercise {
    name: string;
    sets?: number | string;
    reps?: number | string;
    weight?: number | string;
    rest?: string;
    notes?: string;
}

interface Props {
    traineeName: string;
    programName?: string;
    exercises: Exercise[];
    completed?: number;
}

function TrainingMonitorCube({ traineeName, programName, exercises, completed = 0 }: Props) {
    const total = exercises.length || 1;
    const percentage = Math.round((completed / total) * 100);

    return (
        <div className="training-monitor-cube">
            <div className="training-monitor-cube__header">
                <img src="/images/trainee.png" alt="Trainee" />
                <h2 className="training-monitor-cube__trainee-name">{traineeName}</h2>
                {programName && (
                    <span className="training-monitor-cube__exercise-name">{programName}</span>
                )}
            </div>

            <div className="training-monitor-cube__progress">
                <div className="training-monitor-cube__progress-label">
                    <h3 className="training-monitor-cube__progress-title">התקדמות</h3>

                    <div
                        className="training-monitor-cube__exercises-count training-monitor-cube__exercises-count--compact"
                        aria-label="מספר תרגילים שהושלמו מתוך הסך הכל"
                    >
                        <span className="training-monitor-cube__exercises-current">{completed}</span>
                        <span className="training-monitor-cube__exercises-sep" aria-hidden="true">/</span>
                        <span className="training-monitor-cube__exercises-total">{total}</span>
                    </div>
                </div>

                <ProgressBar value={completed} max={total} />
                <span className="training-monitor-cube__progress-percentage">{percentage}% הושלם</span>
            </div>

            <div className="training-monitor-cube__list">
                <ExerciseList exercises={exercises} />
            </div>
        </div>
    );
}

export default TrainingMonitorCube;
