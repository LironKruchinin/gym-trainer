export function parseSize(size: string): number {
    const units = {
        B: 1,
        KB: 1024,
        MB: 1024 * 1024,
        GB: 1024 * 1024 * 1024,
    };

    const match = size.trim().toUpperCase().match(/^(\d+(?:\.\d+)?)\s*(B|KB|MB|GB)$/);
    if (!match) throw new Error(`Invalid size format: ${size}`);

    const [, value, unit] = match;
    return Math.round(parseFloat(value) * units[unit as keyof typeof units]);
}
