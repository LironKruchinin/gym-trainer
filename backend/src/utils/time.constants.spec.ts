import { MINUTE, HOUR, DAY } from './time.constants';

describe('time constants', () => {
    it('minute definition', () => {
        expect(MINUTE).toBe(60000);
    });
    it('hour definition', () => {
        expect(HOUR).toBe(60 * MINUTE);
    });
    it('day definition', () => {
        expect(DAY).toBe(24 * HOUR);
    });
});