package voxta.authentication.handlers;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.client.*;
import com.mongodb.client.model.Filters;
import io.javalin.http.Context;
import org.bson.Document;
import org.json.JSONObject;
import voxta.authentication.model.MongoConnection;
import voxta.authentication.utils.Transform;
import voxta.authentication.utils.crypto.DecryptionUtil;
import voxta.authentication.utils.crypto.EncryptionUtil;
import voxta.authentication.utils.crypto.EncryptionUtil.EncryptedMessage;

import java.util.*;

public class GetInfoToJwtHandler {
    private static String secretKey;

    public static void init(String key) {
        secretKey = key;
    }

    @SuppressWarnings("unchecked")
    public static void handle(Context ctx) {
        try {
            Map<String, Object> body = ctx.bodyAsClass(Map.class);
            String key = (String) body.get("key");

            Map<String, Object> data = (Map<String, Object>) body.get("data");
            String encryptedData = (String) data.get("data");
            String encryptedKey = (String) data.get("key");

            if (encryptedData == null || encryptedKey == null) {
                ctx.json(Map.of("code", 0, "data", "no data"));
                return;
            }

            String decryptedJson = DecryptionUtil.decrypt(encryptedData, encryptedKey);

            JSONObject json = new JSONObject(decryptedJson);
            String jwtToken = json.optString("jwt", null);
            String id = json.optString("id", null);

            if (jwtToken == null || id == null) {
                ctx.json(Map.of("code", 0, "data", "no data"));
                return;
            }

            String userId;
            try {
                userId = JWT.require(Algorithm.HMAC256(secretKey))
                    .build()
                    .verify(jwtToken)
                    .getClaim("userId").asString();
            } catch (Exception e) {
                ctx.json(Map.of("code", 0, "data", "error jwt no user"));
                return;
            }

            if (!id.equals(userId)) {
                ctx.json(Map.of("code", 0, "data", "error jwt no user"));
                return;
            }

            MongoClient client = MongoConnection.getMongoClient();
            MongoDatabase db = client.getDatabase("users");
            MongoCollection<Document> userCollection = db.getCollection(id);

            Document config = userCollection.find(Filters.eq("_id", "config")).first();
            if (config == null) {
                ctx.json(Map.of("code", 0, "data", "error user not found"));
                return;
            }

            Object rawId = config.get("id");
            if (rawId != null) {
                config.put("_id", rawId);
                config.remove("id");
            }

            Map<String, Object> user = Transform.transformUser(config);

            MongoCollection<Document> jwtCollection = db.getCollection(id);
            Document jwtDoc = jwtCollection.find(Filters.eq("_id", "jwt")).first();
            List<String> tokens = jwtDoc != null ? (List<String>) jwtDoc.get("token") : new ArrayList<>();

            if (!tokens.contains(jwtToken)) {
                ctx.json(Map.of("code", 0, "data", "error jwt not found"));
                return;
            }

            ObjectMapper mapper = new ObjectMapper();
            String dataToEncrypt = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(user);

            EncryptedMessage encrypted = EncryptionUtil.encrypt(key, dataToEncrypt);

            ctx.json(Map.of(
                "code", 1,
                "data", Map.of(
                    "key", encrypted.key,
                    "data", encrypted.data
                )
            ));

        } catch (Exception e) {
            e.printStackTrace();
            ctx.json(Map.of("code", 0, "data", "error jwt"));
        }
    }
}
