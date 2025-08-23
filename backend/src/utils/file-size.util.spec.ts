import { parseSize } from './file-size.util';

describe('parseSize', () => {
    it('parses megabytes', () => {
        expect(parseSize('1MB')).toBe(1024 * 1024);
    });

    it('parses kilobytes with space', () => {
        expect(parseSize('1 KB')).toBe(1024);
    });

    it('throws on invalid format', () => {
        expect(() => parseSize('123XYZ')).toThrow();
    });
});