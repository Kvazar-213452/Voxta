package voxta.authentication.utils.crypto;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import java.io.File;
import java.nio.file.Files;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.Base64;

public class DecryptionUtil {
    public static String decrypt(String encryptedData, String encryptedKeyBase64) throws Exception {
        PrivateKey privateKey = loadPrivateKey("private_key.pem");

        byte[] encryptedKeyBytes;
        try {
            encryptedKeyBytes = Base64.getDecoder().decode(encryptedKeyBase64);
        } catch (Exception e) {
            throw new Exception("Failed to decode encrypted key from Base64: " + e.getMessage());
        }

        Cipher rsaCipher = Cipher.getInstance("RSA/ECB/PKCS1Padding");
        rsaCipher.init(Cipher.DECRYPT_MODE, privateKey);
        
        byte[] aesKey;
        try {
            aesKey = rsaCipher.doFinal(encryptedKeyBytes);
        } catch (Exception e) {
            System.err.println("RSA decryption failed: " + e.getMessage());

            try {
                rsaCipher = Cipher.getInstance("RSA/ECB/OAEPPadding");
                rsaCipher.init(Cipher.DECRYPT_MODE, privateKey);
                aesKey = rsaCipher.doFinal(encryptedKeyBytes);
            } catch (Exception e2) {
                throw new Exception("RSA decryption failed with both PKCS1 and OAEP padding: " + e.getMessage());
            }
        }

        String[] parts = encryptedData.split("\\.");
        if (parts.length != 2) {
            throw new IllegalArgumentException("Invalid encrypted data format. Expected format: iv.encryptedMessage");
        }

        byte[] iv;
        byte[] encryptedMessage;
        
        try {
            iv = Base64.getDecoder().decode(parts[0]);
        } catch (Exception e) {
            throw new Exception("Failed to decode IV from Base64: " + e.getMessage());
        }
        
        try {
            encryptedMessage = Base64.getDecoder().decode(parts[1]);
        } catch (Exception e) {
            throw new Exception("Failed to decode encrypted message from Base64: " + e.getMessage());
        }

        try {
            Cipher aesCipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
            SecretKeySpec secretKeySpec = new SecretKeySpec(aesKey, "AES");
            aesCipher.init(Cipher.DECRYPT_MODE, secretKeySpec, new IvParameterSpec(iv));

            byte[] decryptedBytes = aesCipher.doFinal(encryptedMessage);
            String result = new String(decryptedBytes, "UTF-8");
            return result;
        } catch (Exception e) {
            System.err.println("AES decryption failed: " + e.getMessage());
            System.err.println("AES key length: " + aesKey.length);
            System.err.println("IV length: " + iv.length);
            System.err.println("Encrypted message length: " + encryptedMessage.length);
            throw new Exception("AES decryption failed: " + e.getMessage());
        }
    }

    private static PrivateKey loadPrivateKey(String filepath) throws Exception {
        String pem = new String(Files.readAllBytes(new File(filepath).toPath()))
                .replaceAll("-----BEGIN PRIVATE KEY-----", "")
                .replaceAll("-----END PRIVATE KEY-----", "")
                .replaceAll("\\s", "");

        byte[] der = Base64.getDecoder().decode(pem);
        PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(der);
        KeyFactory kf = KeyFactory.getInstance("RSA");
        return kf.generatePrivate(spec);
    }
}
