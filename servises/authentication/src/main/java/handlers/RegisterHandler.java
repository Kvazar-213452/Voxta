package voxta.authentication.handlers;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.javalin.http.Context;
import org.json.JSONObject;
import voxta.authentication.utils.crypto.DecryptionUtil;
import voxta.authentication.utils.crypto.EncryptionUtil;
import voxta.authentication.utils.crypto.EncryptionUtil.EncryptedMessage;
import voxta.authentication.utils.SendNotification;
import voxta.authentication.utils.Generate;
import voxta.authentication.Config;

import java.util.*;

public class RegisterHandler {
    private static String secretKey;

    public static void init(String key) {
        secretKey = key;
    }

    @SuppressWarnings("unchecked")
    public static void handle(Context ctx) {
        try {
            Map<String, Object> body = ctx.bodyAsClass(Map.class);
            String clientKey = (String) body.get("key");

            Map<String, Object> data = (Map<String, Object>) body.get("data");
            String encryptedData = (String) data.get("data");
            String encryptedAesKey = (String) data.get("key");

            if (encryptedData == null || encryptedAesKey == null) {
                ctx.status(400).json(Map.of("code", 0, "error", "no data"));
                return;
            }

            String decryptedJson = DecryptionUtil.decrypt(encryptedData, encryptedAesKey);
            JSONObject parsed = new JSONObject(decryptedJson);

            String name = parsed.getString("name");
            String password = parsed.getString("password");
            String gmail = parsed.getString("gmail");

            String code = Generate.generateSixDigitCode();

            SendNotification.sendNotification(code, gmail);

            String tempToken = JWT.create()
                    .withClaim("name", name)
                    .withClaim("password", password)
                    .withClaim("gmail", gmail)
                    .withClaim("code", code)
                    .withExpiresAt(new Date(System.currentTimeMillis() + 5 * 60 * 1000))
                    .sign(Algorithm.HMAC256(secretKey));

            ObjectMapper mapper = new ObjectMapper();
            String jsonResponse = mapper.writeValueAsString(Map.of("tempToken", tempToken));
            EncryptedMessage encrypted = EncryptionUtil.encrypt(clientKey, jsonResponse);

            ctx.json(Map.of(
                    "code", 1,
                    "data", Map.of(
                            "key", encrypted.key,
                            "data", encrypted.data
                    )
            ));
        } catch (Exception e) {
            e.printStackTrace();
            ctx.status(500).json(Map.of("code", 0, "error", "error_server"));
        }
    }
}
