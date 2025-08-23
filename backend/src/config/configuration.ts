export default () => ({
    database: {
        url: process.env.DB_URL!,
        ssl: process.env.DB_SSL === 'true',
    },
});
