package voxta.authentication.utils.crypto;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.util.Base64;

public class KeyGeneratorUtil {
    
    public static void generateKeys() throws NoSuchAlgorithmException, IOException {
        File publicKeyFile = new File("public_key.pem");
        File privateKeyFile = new File("private_key.pem");
        
        if (publicKeyFile.exists() && privateKeyFile.exists()) {
            System.out.println("Keys already exist, skipping generation.");
            return;
        }
        
        System.out.println("Generating RSA key pair...");
        
        KeyPairGenerator keyGen = KeyPairGenerator.getInstance("RSA");
        keyGen.initialize(2048);
        KeyPair keyPair = keyGen.generateKeyPair();
        
        PublicKey publicKey = keyPair.getPublic();
        PrivateKey privateKey = keyPair.getPrivate();

        String publicKeyPem = "-----BEGIN PUBLIC KEY-----\n" +
                Base64.getEncoder().encodeToString(publicKey.getEncoded()) + "\n" +
                "-----END PUBLIC KEY-----";
        
        try (FileWriter writer = new FileWriter(publicKeyFile)) {
            writer.write(publicKeyPem);
        }
        
        String privateKeyPem = "-----BEGIN PRIVATE KEY-----\n" +
                Base64.getEncoder().encodeToString(privateKey.getEncoded()) + "\n" +
                "-----END PRIVATE KEY-----";
        
        try (FileWriter writer = new FileWriter(privateKeyFile)) {
            writer.write(privateKeyPem);
        }

        System.out.println("Public key saved to: " + publicKeyFile.getAbsolutePath());
        System.out.println("Private key saved to: " + privateKeyFile.getAbsolutePath());
    }
}
