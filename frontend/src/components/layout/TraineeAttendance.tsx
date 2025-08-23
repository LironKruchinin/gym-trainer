import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faClock } from "@fortawesome/free-solid-svg-icons";

function TraineeAttendance() {
    return (
        <div className="trainee-attendance">
            <div className="trainee-attendance__details">
                <div className="trainee-attendance__status trainee-attendance__status--waiting">ממתין</div> {/* This is the status of the trainee, can be "ממתין" (--waiting), "מתאמן" (--active), "ביטל" (--canceled), or "סיים" (--finished) */}

                <div className="trainee-attendance__details">
                    <FontAwesomeIcon className="icon" icon={faUser} />
                    <span className="trainee-attendance__name">שם המתאמן</span>

                    <div className="trainee-attendance__time">
                        <FontAwesomeIcon className="icon" icon={faClock} />
                        <div className="trainee-attendance__time-value">
                            00:00
                            <span className="trainee-attendance__time-duration">(שעה)</span>
                        </div>
                    </div>
                </div>
            </div>
            <button className="trainee-attendance__action">
                <span className="trainee-attendance__action-text">פתח מסך אימון</span>
            </button>
        </div>
    );
}

export default TraineeAttendance;
