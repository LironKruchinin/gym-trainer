import { DbInitService } from './db-init.service';
import { DataSource } from 'typeorm';

describe('DbInitService', () => {
    it('creates missing tables', async () => {
        const queries: string[] = [];
        const runner = {
            connect: jest.fn(),
            release: jest.fn(),
            hasTable: jest.fn().mockResolvedValueOnce(false).mockResolvedValueOnce(true),
            query: jest.fn((q: string) => { queries.push(q); }),
        } as any;
        const ds = { createQueryRunner: () => runner } as DataSource;
        const service = new DbInitService(ds as any);
        (service as any).tables = [
            { tbl_name: 'a', dependencies: [] },
            { tbl_name: 'b', dependencies: [] },
        ];
        (service as any).tableDefinitions = { a: 'CREATE A;', b: 'CREATE B;' };
        await service.onModuleInit();
        expect(runner.connect).toHaveBeenCalled();
        expect(queries).toContain('CREATE A;');
        expect(queries).not.toContain('CREATE B;');
        expect(runner.release).toHaveBeenCalled();
    });
});