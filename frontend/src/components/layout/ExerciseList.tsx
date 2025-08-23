import React from "react";

function ExerciseList() {
    return (
        <div className="exercise">
            <div className="exercise__header">
                <h3 className="exercise__title">סקוואט</h3>
                {/* add a modifier to change color: exercise__status--done | --inprogress | --idle */}
                <span className="exercise__status exercise__status--idle" />
            </div>

            <ul className="exercise__details">
                <li className="exercise__item exercise__item--sets">
                    <span className="exercise__label">סטים:</span>
                    <span className="exercise__value">3</span>
                </li>

                <li className="exercise__item exercise__item--reps">
                    <span className="exercise__label">חזרות:</span>
                    <span className="exercise__value">8-12</span>
                </li>

                <li className="exercise__item exercise__item--weight">
                    <span className="exercise__label">משקל:</span>
                    <span className="exercise__value">50kg</span>
                </li>

                <li className="exercise__item exercise__item--rest">
                    <span className="exercise__label">מנוחה:</span>
                    <span className="exercise__value">60s</span>
                </li>
            </ul>
        </div>
    );
}

export default ExerciseList;
