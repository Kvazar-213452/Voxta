package voxta.authentication;

import javax.crypto.Cipher;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

public class CryptoUtils {
    public static void generateKeys() {
        try {
            java.security.KeyPairGenerator keyGen = java.security.KeyPairGenerator.getInstance("RSA");
            keyGen.initialize(4096);
            java.security.KeyPair keyPair = keyGen.generateKeyPair();

            // Отримання ключів у форматі PEM
            String publicKey = "-----BEGIN RSA PUBLIC KEY-----\n" +
                    Base64.getMimeEncoder().encodeToString(keyPair.getPublic().getEncoded()) +
                    "\n-----END RSA PUBLIC KEY-----";

            String privateKey = "-----BEGIN RSA PRIVATE KEY-----\n" +
                    Base64.getMimeEncoder().encodeToString(keyPair.getPrivate().getEncoded()) +
                    "\n-----END RSA PRIVATE KEY-----";

            // Збереження ключів у файли
            Files.writeString(Path.of("public_key.pem"), publicKey);
            Files.writeString(Path.of("private_key.pem"), privateKey);
        } catch (Exception e) {
            throw new RuntimeException("Помилка генерації ключів", e);
        }
    }

    public static String encryptServer(String message) {
        try {
            String publicKeyPem = Files.readString(Path.of("public_key.pem"));
            publicKeyPem = publicKeyPem.replace("-----BEGIN RSA PUBLIC KEY-----", "")
                    .replace("-----END RSA PUBLIC KEY-----", "")
                    .replaceAll("\\s", "");

            byte[] decoded = Base64.getDecoder().decode(publicKeyPem);
            X509EncodedKeySpec spec = new X509EncodedKeySpec(decoded);
            PublicKey publicKey = KeyFactory.getInstance("RSA").generatePublic(spec);

            Cipher cipher = Cipher.getInstance("RSA");
            cipher.init(Cipher.ENCRYPT_MODE, publicKey);
            byte[] encrypted = cipher.doFinal(message.getBytes());

            return Base64.getEncoder().encodeToString(encrypted);
        } catch (Exception e) {
            throw new RuntimeException("Помилка шифрування", e);
        }
    }

    public static String encryptMsg(String key, String message) {
        try {
            key = key.replace("-----BEGIN RSA PUBLIC KEY-----", "")
                    .replace("-----END RSA PUBLIC KEY-----", "")
                    .replaceAll("\\s", "");

            byte[] decoded = Base64.getDecoder().decode(key);
            X509EncodedKeySpec spec = new X509EncodedKeySpec(decoded);
            PublicKey publicKey = KeyFactory.getInstance("RSA").generatePublic(spec);

            Cipher cipher = Cipher.getInstance("RSA");
            cipher.init(Cipher.ENCRYPT_MODE, publicKey);
            byte[] encrypted = cipher.doFinal(message.getBytes());

            return Base64.getEncoder().encodeToString(encrypted);
        } catch (Exception e) {
            throw new RuntimeException("Помилка шифрування", e);
        }
    }

    public static String decryptServer(String message) {
        try {
            String privateKeyPem = Files.readString(Path.of("private_key.pem"));
            privateKeyPem = privateKeyPem.replace("-----BEGIN RSA PRIVATE KEY-----", "")
                    .replace("-----END RSA PRIVATE KEY-----", "")
                    .replaceAll("\\s", "");

            byte[] decoded = Base64.getDecoder().decode(privateKeyPem);
            PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(decoded);
            PrivateKey privateKey = KeyFactory.getInstance("RSA").generatePrivate(spec);

            Cipher cipher = Cipher.getInstance("RSA");
            cipher.init(Cipher.DECRYPT_MODE, privateKey);
            byte[] decrypted = cipher.doFinal(Base64.getDecoder().decode(message));

            return new String(decrypted);
        } catch (Exception e) {
            throw new RuntimeException("Помилка дешифрування", e);
        }
    }
}