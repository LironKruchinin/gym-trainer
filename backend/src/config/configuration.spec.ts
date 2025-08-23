import configuration from './configuration';

describe('configuration', () => {
    it('reads env vars', () => {
        process.env.DB_URL = 'postgres://test';
        process.env.DB_SSL = 'true';
        const cfg = configuration();
        expect(cfg.database.url).toBe('postgres://test');
        expect(cfg.database.ssl).toBe(true);
    });
});