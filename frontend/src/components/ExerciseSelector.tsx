import { exercises } from '../data/exercises';
import SearchableSelect from './ui/SearchableSelect';

interface Props {
    value: string;
    onChange: (val: string) => void;
}

export default function ExerciseSelector({ value, onChange }: Props) {
    return (
        <SearchableSelect
            options={exercises}
            value={value}
            onChange={onChange}
            inputClassName="program-edit__input"
        />
    );
}
