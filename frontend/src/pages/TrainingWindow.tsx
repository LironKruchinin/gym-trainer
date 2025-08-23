import React, { useState } from 'react';
import TrainingProgramModal from '../components/TrainingProgramModal';

export default function TrainingWindow() {
    const [open, setOpen] = useState(false);

    return (
        <div className="training-window container">
            <h1 className="training-window__title">מסך אימון</h1>
            <p className="training-window__subtitle">בחר מתאמן כדי להתחיל אימון</p>
            <button className="training-window__open-modal" onClick={() => setOpen(true)}>
                תוכניות אימון
            </button>
            <TrainingProgramModal isOpen={open} onClose={() => setOpen(false)} />
        </div>
    );
}

