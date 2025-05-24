// user/func.ts

export function generate_code(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
