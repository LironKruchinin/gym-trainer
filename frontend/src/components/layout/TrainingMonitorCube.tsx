import React from 'react'
import ExerciseList from './ExerciseList'
import ProgressBar from '../ui/ProgressBar'

function TrainingMonitorCube() {
    return (
        <div className="training-monitor-cube">
            <div className="training-monitor-cube__header">
                <img src="/images/trainee.png" alt="Trainee" />
                <h2 className="training-monitor-cube__trainee-name">ג'ון סמות</h2>
                <span className="training-monitor-cube__exercise-name">בניית כוח</span>
            </div>

            <div className="training-monitor-cube__progress">
                <div className="training-monitor-cube__progress-label">
                    <h3 className="training-monitor-cube__progress-title">התקדמות</h3>

                    <div
                        className="training-monitor-cube__exercises-count training-monitor-cube__exercises-count--compact"
                        aria-label="מספר תרגילים שהושלמו מתוך הסך הכל"
                    >
                        <span className="training-monitor-cube__exercises-current">0</span>
                        <span className="training-monitor-cube__exercises-sep" aria-hidden="true">/</span>
                        <span className="training-monitor-cube__exercises-total">4</span>
                    </div>
                </div>

                <ProgressBar value={0} />
                <span className="training-monitor-cube__progress-percentage">0% הושלם</span>
            </div>

            <div className="training-monitor-cube__list">
                <ExerciseList />
            </div>
        </div>

    )
}

export default TrainingMonitorCube