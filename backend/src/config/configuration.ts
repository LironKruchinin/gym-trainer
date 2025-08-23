export default () => ({
    database: {
        url: process.env.DB_URL,                 // e.g. postgres://postgres:admin@localhost:5432/postgres
        ssl: String(process.env.DB_SSL).toLowerCase() === 'true',
    },
});
