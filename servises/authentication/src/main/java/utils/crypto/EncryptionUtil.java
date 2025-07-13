package voxta.authentication.utils.crypto;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import java.security.PublicKey;
import java.security.KeyFactory;
import java.security.SecureRandom;
import java.security.spec.MGF1ParameterSpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

import javax.crypto.spec.OAEPParameterSpec;
import javax.crypto.spec.PSource;

public class EncryptionUtil {

    public static class EncryptedMessage {
        public final String key;
        public final String data;

        public EncryptedMessage(String key, String data) {
            this.key = key;
            this.data = data;
        }
    }

    public static EncryptedMessage encrypt(String publicRsaKeyPem, String message) throws Exception {
        byte[] aesKeyBytes = new byte[32];
        new SecureRandom().nextBytes(aesKeyBytes);
        SecretKey aesKey = new SecretKeySpec(aesKeyBytes, "AES");

        byte[] iv = new byte[16];
        new SecureRandom().nextBytes(iv);
        IvParameterSpec ivSpec = new IvParameterSpec(iv);

        Cipher aesCipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
        aesCipher.init(Cipher.ENCRYPT_MODE, aesKey, ivSpec);
        byte[] encryptedBytes = aesCipher.doFinal(message.getBytes("UTF-8"));
        String encryptedData = Base64.getEncoder().encodeToString(encryptedBytes);

        PublicKey publicKey = loadPublicKey(publicRsaKeyPem);

        Cipher rsaCipher = Cipher.getInstance("RSA/ECB/OAEPWithSHA-256AndMGF1Padding");
        OAEPParameterSpec oaepParams = new OAEPParameterSpec(
            "SHA-256",
            "MGF1",
            MGF1ParameterSpec.SHA256,
            PSource.PSpecified.DEFAULT
        );
        rsaCipher.init(Cipher.ENCRYPT_MODE, publicKey, oaepParams);
        byte[] encryptedKeyBytes = rsaCipher.doFinal(aesKeyBytes);
        String encryptedKey = Base64.getEncoder().encodeToString(encryptedKeyBytes);

        String data = Base64.getEncoder().encodeToString(iv) + "." + encryptedData;

        return new EncryptedMessage(encryptedKey, data);
    }

    private static PublicKey loadPublicKey(String pem) throws Exception {
        String publicKeyPEM = pem
            .replace("-----BEGIN PUBLIC KEY-----", "")
            .replace("-----END PUBLIC KEY-----", "")
            .replaceAll("\\s", "");

        byte[] decoded = Base64.getDecoder().decode(publicKeyPEM);
        X509EncodedKeySpec spec = new X509EncodedKeySpec(decoded);
        KeyFactory kf = KeyFactory.getInstance("RSA");
        return kf.generatePublic(spec);
    }
}
