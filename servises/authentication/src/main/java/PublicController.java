package voxta.authentication;

import io.javalin.http.Context;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import java.util.HashMap;

public class PublicController {
    public void getPublicKey(Context ctx) {
        try {
            String publicKey = Files.readString(Path.of("public_key.pem"));
            ctx.json(Map.of("key", publicKey));
        } catch (Exception e) {
            ctx.status(500).json(Map.of("error", "Не вдалося прочитати публічний ключ"));
        }
    }
}