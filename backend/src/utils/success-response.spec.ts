import { successResponse } from './success-response';

describe('successResponse', () => {
    it('wraps message and data', () => {
        const res = successResponse('ok', { a: 1 });
        expect(res).toEqual({ success: true, loading: false, message: 'ok', data: { a: 1 } });
    });
});