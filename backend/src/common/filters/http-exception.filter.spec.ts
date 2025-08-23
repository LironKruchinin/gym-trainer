import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { GlobalExceptionFilter } from './http-exception.filter';

describe('GlobalExceptionFilter', () => {
    it('formats http exception', () => {
        const filter = new GlobalExceptionFilter();
        const json = jest.fn();
        const status = jest.fn();
        const ctx = {
            switchToHttp: () => ({
                getResponse: () => ({ status, json }),
                getRequest: () => ({ url: '/x' }),
            }),
        } as unknown as ArgumentsHost;

        status.mockReturnValue({ json });

        filter.catch(new HttpException('oops', HttpStatus.BAD_REQUEST), ctx);
        expect(status).toHaveBeenCalledWith(400);
        expect(json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    });
});