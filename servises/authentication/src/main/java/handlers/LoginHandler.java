package voxta.authentication.handlers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import io.javalin.http.Context;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;

import org.bson.Document;
import org.json.JSONObject;
import voxta.authentication.model.MongoConnection;
import voxta.authentication.utils.crypto.DecryptionUtil;
import voxta.authentication.utils.crypto.EncryptionUtil;
import voxta.authentication.utils.crypto.EncryptionUtil.EncryptedMessage;

import voxta.authentication.utils.Transform;

import java.util.*;

public class LoginHandler {
    private static String secretKey;

    public static void init(String key) {
        secretKey = key;
    }

    @SuppressWarnings("unchecked")
    public static void handle(Context ctx) {
        try {
            Map<String, Object> body = ctx.bodyAsClass(Map.class);
            Object dataObj = body.get("data");


            if (!(dataObj instanceof Map)) {
                ctx.status(400).result("Invalid 'data' format");
                return;
            }

            Map<String, Object> encryptedData = (Map<String, Object>) dataObj;
            String ivAndEncryptedMessage = (String) encryptedData.get("data");
            String encryptedAesKey = (String) encryptedData.get("key");

            if (ivAndEncryptedMessage == null || encryptedAesKey == null) {
                ctx.status(400).result("Missing 'data' or 'key' field in encrypted data");
                return;
            }

            String decryptedMessage = DecryptionUtil.decrypt(ivAndEncryptedMessage, encryptedAesKey);

            JSONObject json = new JSONObject(decryptedMessage);
            String name = json.getString("name");
            String password = json.getString("password");

            MongoClient client = MongoConnection.getMongoClient();
            MongoDatabase db = client.getDatabase("users");

            String foundUserCollectionName = null;
            Document foundUser = null;

            for (String collectionName : db.listCollectionNames()) {
                MongoCollection<Document> collection = db.getCollection(collectionName);
                Document config = collection.find(Filters.eq("_id", "config")).first();

                if (config != null && name.equals(config.getString("name")) && password.equals(config.getString("password"))) {
                    foundUser = new Document(config);
                    foundUserCollectionName = collectionName;
                    break;
                }
            }

            if (foundUser == null || foundUserCollectionName == null) {
                ctx.status(404).json(Map.of("code", 0, "error", "user_none"));
                return;
            }

            Object id = foundUser.get("id");
            if (id != null) {
                foundUser.put("_id", id);
                foundUser.remove("id");
            }

            String userId = foundUser.getString("_id");
            String token = JWT.create()
                .withClaim("userId", userId)
                .withExpiresAt(new Date(System.currentTimeMillis() + 24 * 60 * 60 * 1000)) // 24 години
                .sign(Algorithm.HMAC256(secretKey));

            MongoCollection<Document> jwtCollection = db.getCollection(foundUserCollectionName);
            Document jwtDoc = jwtCollection.find(Filters.eq("_id", "jwt")).first();

            if (jwtDoc != null) {
                List<String> tokens = (List<String>) jwtDoc.get("token");
                if (tokens == null) tokens = new ArrayList<>();
                tokens.add(token);
                jwtCollection.updateOne(Filters.eq("_id", "jwt"), new Document("$set", new Document("token", tokens)));
            } else {
                jwtCollection.insertOne(new Document("_id", "jwt").append("token", List.of(token)));
            }

            Map<String, Object> user = Transform.transformUser(foundUser);

            String clientPublicKey = (String) body.get("key");

            ObjectMapper mapper = new ObjectMapper();
            String jsonResponse = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(
                Map.of("token", token, "user", user)
            );

            EncryptedMessage encrypted = EncryptionUtil.encrypt(clientPublicKey, jsonResponse);

            ctx.status(200).json(Map.of(
                "code", 1,
                "data", Map.of(
                    "key", encrypted.key,
                    "data", encrypted.data
                )
            ));

        } catch (Exception e) {
            e.printStackTrace();
            ctx.status(500).result("Decryption error: " + e.getMessage());
        }
    }
}
