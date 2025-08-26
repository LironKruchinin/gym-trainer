import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faClock } from '@fortawesome/free-solid-svg-icons';
import type { Trainee } from '@store/slices/api/Trainee';

interface Props {
    trainee: Trainee;
}

function TraineeAttendance({ trainee }: Props) {
    const time = new Date(trainee.reservedTime).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <div className="trainee-attendance">
            <div className="trainee-attendance__details">
                <div className="trainee-attendance__status trainee-attendance__status--waiting">ממתין</div>
                <div className="trainee-attendance__details">
                    <FontAwesomeIcon className="icon" icon={faUser} />
                    <span className="trainee-attendance__name">{trainee.name}</span>

                    <div className="trainee-attendance__time">
                        <FontAwesomeIcon className="icon" icon={faClock} />
                        <div className="trainee-attendance__time-value">
                            {time}
                            <span className="trainee-attendance__time-duration">(שעה)</span>
                        </div>
                    </div>
                </div>
            </div>
            {trainee.program?.exercises && trainee.program.exercises.length > 0 && (
                <ul className="trainee-attendance__exercise-list">
                    {trainee.program.exercises.map((ex, idx) => (
                        <li key={idx} className="trainee-attendance__exercise-item">
                            {ex.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default TraineeAttendance;

