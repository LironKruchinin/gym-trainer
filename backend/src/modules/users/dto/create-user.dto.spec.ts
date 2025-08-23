import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

describe('CreateUserDto Validation', () => {
    const base = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        password: 'Secret123',
    };

    it('accepts valid input', async () => {
        const dto = plainToInstance(CreateUserDto, base);
        const errors = await validate(dto);
        expect(errors.length).toBe(0);
    });

    it('rejects invalid email', async () => {
        const dto = plainToInstance(CreateUserDto, { ...base, email: 'not-an-email' });
        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
    });

    it('rejects SQL injection attempt', async () => {
        const dto = plainToInstance(CreateUserDto, { ...base, email: "'; DROP TABLE users; --" });
        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
    });

    it('rejects very long first name', async () => {
        const dto = plainToInstance(CreateUserDto, { ...base, first_name: 'a'.repeat(101) });
        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
    });
});