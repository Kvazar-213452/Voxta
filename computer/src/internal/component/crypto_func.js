const crypto = require('crypto');
const fs = require('fs');
const axios = require('axios');
const { saveKeys, getPublicKey, getPrivateKey } = require('./storage_app');
const { config } = require('../../config');

async function generate_key() {
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

    await saveKeys(publicKey, privateKey);
}

async function getPublicKey_server() {
    const response = await axios.get("http://localhost:3000/public_key");
    
    return response.data;
}

// ======= encryption ENDPOINT ===========
async function encryption_app(message) {
    const publicKey = await getPublicKey();
    const encrypted = crypto.publicEncrypt(publicKey, Buffer.from(message, 'utf8'));
    
    return encrypted.toString('base64');
}

function encryption_msg(key, message) {
    const encrypted = crypto.publicEncrypt(key, Buffer.from(message, 'utf8'));
    
    return encrypted.toString('base64');
}

// ======= decryption ENDPOINT ===========
async function decryption_app(message) {
    const privateKey = await getPrivateKey();
    const decrypted = crypto.privateDecrypt(privateKey, message);
    
    return decrypted.toString('utf8');
}


module.exports = {
    decryption_app,
    encryption_msg,
    encryption_app,

    getPublicKey_server,
    generate_key,
};