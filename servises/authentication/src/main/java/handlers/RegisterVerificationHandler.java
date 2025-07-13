package voxta.authentication.handlers;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
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
import voxta.authentication.Config;
import voxta.authentication.utils.Generate;

import java.util.*;

public class RegisterVerificationHandler {
    private static String secretKey;

    public static void init(String key) {
        secretKey = key;
    }

    @SuppressWarnings("unchecked")
    public static void handle(Context ctx) {
        try {
            Map<String, Object> body = ctx.bodyAsClass(Map.class);
            String clientPublicKey = (String) body.get("key");

            Map<String, Object> encryptedData = (Map<String, Object>) body.get("data");
            String encrypted = (String) encryptedData.get("data");
            String encryptedKey = (String) encryptedData.get("key");

            if (encrypted == null || encryptedKey == null) {
                ctx.json(Map.of("code", 0));
                return;
            }

            String decrypted = DecryptionUtil.decrypt(encrypted, encryptedKey);
            JSONObject parsed = new JSONObject(decrypted);

            String inputCode = parsed.getString("code");
            String tempTokenVal = parsed.getString("tempToken");

            DecodedJWT decoded = JWT.require(Algorithm.HMAC256(secretKey)).build().verify(tempTokenVal);
            String name = decoded.getClaim("name").asString();
            String password = decoded.getClaim("password").asString();
            String gmail = decoded.getClaim("gmail").asString();
            String realCode = decoded.getClaim("code").asString();

            if (!inputCode.equals(realCode)) {
                ctx.json(Map.of("code", 0));
                return;
            }

            MongoClient client = MongoConnection.getMongoClient();
            MongoDatabase db = client.getDatabase("users");

            String userID = Generate.generateId();
            while (collectionExists(db, userID)) {
                userID = Generate.generateId();
            }

            MongoCollection<Document> chatCollection = db.getCollection(userID);

            Document dataConfig = new Document()
                    .append("_id", "config")
                    .append("name", name)
                    .append("password", password)
                    .append("avatar", Config.DEFAULT_AVATAR)
                    .append("time", new Date().toInstant().toString())
                    .append("desc", "new account")
                    .append("id", userID)
                    .append("gmail", gmail)
                    .append("chats", List.of(Config.MAIN_CHAT_ID));

            chatCollection.insertOne(dataConfig);

            String userToken = JWT.create()
                    .withSubject(userID)
                    .withClaim("userId", userID)
                    .withExpiresAt(new Date(System.currentTimeMillis() + 24 * 60 * 60 * 1000))
                    .sign(Algorithm.HMAC256(secretKey));

            MongoCollection<Document> jwtCollection = db.getCollection(userID);
            Document jwtDoc = jwtCollection.find(Filters.eq("_id", "jwt")).first();

            if (jwtDoc != null) {
                List<String> tokens = (List<String>) jwtDoc.get("token");
                if (tokens == null) tokens = new ArrayList<>();
                tokens.add(userToken);
                jwtCollection.updateOne(Filters.eq("_id", "jwt"), new Document("$set", new Document("token", tokens)));
            } else {
                jwtCollection.insertOne(new Document("_id", "jwt").append("token", List.of(userToken)));
            }

            Map<String, Object> userMap = Transform.transformUser(dataConfig);

            ObjectMapper mapper = new ObjectMapper();
            String responsePayload = mapper.writeValueAsString(Map.of(
                    "token", userToken,
                    "user", userMap
            ));

            EncryptedMessage encryptedResponse = EncryptionUtil.encrypt(clientPublicKey, responsePayload);

            ctx.json(Map.of(
                    "code", 1,
                    "data", Map.of(
                            "key", encryptedResponse.key,
                            "data", encryptedResponse.data
                    )
            ));
        } catch (Exception e) {
            e.printStackTrace();
            ctx.status(500).json(Map.of("code", 0, "error", "error_server"));
        }
    }

    private static boolean collectionExists(MongoDatabase db, String name) {
        for (String collectionName : db.listCollectionNames()) {
            if (collectionName.equals(name)) {
                return true;
            }
        }
        return false;
    }
}
