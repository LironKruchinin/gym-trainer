import { useEffect, useState } from 'react';
import SearchableSelect from './ui/SearchableSelect';
import { getPrograms, type Program } from '../services/trainingPrograms';
import type { Trainee } from '@store/slices/api/Trainee';
import { useAssignProgramMutation } from '@store/slices/api/apiSlice';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    trainee: Trainee;
}

export default function TrainingProgramModal({ isOpen, onClose, trainee }: Props) {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [selection, setSelection] = useState('');
    const trainingOptions = ['כוח', 'קרדיו', 'גמישות'];
    const [assignProgram] = useAssignProgramMutation();

    useEffect(() => {
        if (isOpen) {
            getPrograms()
                .then(setPrograms)
                .catch((err) => console.error(err));
        }
    }, [isOpen]);

    const handleSelect = async (program: Program) => {
        if (!program.id) return;
        try {
            await assignProgram({ id: trainee.id, programId: program.id }).unwrap();
            onClose();
        } catch (err) {
            console.error(err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="training-program-modal">
            <div className="training-program-modal__header">
                <h2>תוכניות אימון</h2>
                <button className="btn btn--error" onClick={onClose}>סגור</button>
            </div>
            <div className="training-program-modal__controls">
                <button className="btn btn--warning training-program-modal__reschedule">העבר תור</button>
                <SearchableSelect
                    options={trainingOptions}
                    value={selection}
                    onChange={setSelection}
                    placeholder="בחר סוג אימון"
                    inputClassName="training-program-modal__input"
                />
            </div>
            <ul className="training-program-modal__list">
                {programs.map((p) => (
                    <li key={p.id} className="training-program-modal__item">
                        <span>{p.name}</span>
                        <div className="training-program-modal__item-actions">
                            <button className="btn btn--success" onClick={() => handleSelect(p)}>
                                בחר
                            </button>
                            <button className="btn btn--warning">העבר זמן</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
