import { randomBytes, createHmac } from 'crypto';

export function generateSalt() {
    return randomBytes(128).toString('base64');
}
export function generateHashedPassword(salt, password) {
    return createHmac('sha256', salt).update(password).digest('hex');
}