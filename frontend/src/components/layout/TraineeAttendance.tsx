import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faClock } from '@fortawesome/free-solid-svg-icons';
import type { Trainee } from '@store/slices/api/Trainee';
import TrainingProgramModal from '@components/TrainingProgramModal';
import { useState } from 'react';

interface Props {
    trainee: Trainee;
}

function TraineeAttendance({ trainee }: Props) {
    const time = new Date(trainee.reservedTime).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
    });

    const [open, setOpen] = useState(false);

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
            <button className="trainee-attendance__action" onClick={() => setOpen(true)}>
                <span className="trainee-attendance__action-text">פתח מסך אימון</span>
            </button>
            <TrainingProgramModal
                trainee={trainee}
                isOpen={open}
                onClose={() => setOpen(false)}
            />
        </div>
    );
}

export default TraineeAttendance;

