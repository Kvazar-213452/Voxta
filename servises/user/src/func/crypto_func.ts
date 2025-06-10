const crypto = require('crypto');
const fs = require('fs');

export function generate_key() {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
        type: 'pkcs1', // 'spki' — сучасний стандарт, 'pkcs1' — простіше
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs1', // 'pkcs8' — більш універсальний, але для початку ok так
        format: 'pem'
    }
    });

    fs.writeFileSync('private_key.pem', privateKey);
    fs.writeFileSync('public_key.pem', publicKey);
}

// ======= encryption ENDPOINT ===========
export function encryption_server(message: string): string {
    const publicKey = fs.readFileSync('public_key.pem', 'utf8');
    const encrypted = crypto.publicEncrypt(publicKey, Buffer.from(message, 'utf8'));
    
    return encrypted.toString('base64');
}

export function encryption_msg(key: string, message: string): string {
    const encrypted = crypto.publicEncrypt(key, Buffer.from(message, 'utf8'));
    
    return encrypted.toString('base64');
}

// ======= decryption ENDPOINT ===========
export function decryption_server(message: string): string {
    const privateKey = fs.readFileSync('private_key.pem', 'utf8');
    const decrypted = crypto.privateDecrypt(privateKey, message);
    
    return decrypted.toString('utf8');
}
