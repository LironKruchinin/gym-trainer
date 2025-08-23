import React from 'react';

interface Exercise {
    name: string;
    sets?: number | string;
    reps?: number | string;
    weight?: number | string;
    rest?: string;
}

export default function ExerciseList({ exercises = [] }: { exercises: Exercise[] }) {
    return (
        <>
            {exercises.map((ex, idx) => (
                <div key={idx} className="exercise">
                    <div className="exercise__header">
                        <h3 className="exercise__title">{ex.name}</h3>
                        <span className="exercise__status exercise__status--idle" />
                    </div>

                    <ul className="exercise__details">
                        {ex.sets !== undefined && (
                            <li className="exercise__item exercise__item--sets">
                                <span className="exercise__label">סטים:</span>
                                <span className="exercise__value">{ex.sets}</span>
                            </li>
                        )}

                        {ex.reps !== undefined && (
                            <li className="exercise__item exercise__item--reps">
                                <span className="exercise__label">חזרות:</span>
                                <span className="exercise__value">{ex.reps}</span>
                            </li>
                        )}

                        {ex.weight !== undefined && (
                            <li className="exercise__item exercise__item--weight">
                                <span className="exercise__label">משקל:</span>
                                <span className="exercise__value">{ex.weight}</span>
                            </li>
                        )}

                        {ex.rest && (
                            <li className="exercise__item exercise__item--rest">
                                <span className="exercise__label">מנוחה:</span>
                                <span className="exercise__value">{ex.rest}</span>
                            </li>
                        )}
                    </ul>
                </div>
            ))}
        </>
    );
}

