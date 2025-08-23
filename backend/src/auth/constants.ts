export const jwtConstants = {
    accessSecret: process.env.JWT_ACCESS_TOKEN_SECRET ?? 'changeme-in-prod-access',
    refreshSecret: process.env.JWT_REFRESH_TOKEN_SECRET ?? 'changeme-in-prod-refresh',
};
