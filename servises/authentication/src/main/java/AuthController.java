package voxta.authentication;

import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;

public class AuthController {
    private static final String SECRET_KEY = "your-very-secret-key-here-1234567890";
    private static final ObjectMapper objectMapper = new ObjectMapper();
    private static final Path DB_PATH = Path.of("db.json");
    private static final Path TOKENS_PATH = Path.of("tokens.json");

    public void login(Context ctx) {
        try {
            Map<String, Object> requestBody = ctx.bodyAsClass(Map.class);
            String encryptedData = (String) requestBody.get("data");
            String clientKey = (String) requestBody.get("key"); // Перейменував змінну key на clientKey

            // Дешифрування даних
            String decryptedData = CryptoUtils.decryptServer(encryptedData);
            Map<String, String> credentials = objectMapper.readValue(decryptedData, Map.class);

            String name = credentials.get("name");
            String password = credentials.get("password");

            // Читання бази даних
            String dbContent = Files.readString(DB_PATH);
            Map<String, Map<String, String>> users = objectMapper.readValue(dbContent, Map.class);

            // Пошук користувача
            Map<String, String> user = users.values().stream()
                .filter(u -> u.get("name").equals(name) && u.get("password").equals(password))
                .findFirst()
                .orElse(null);

            if (user == null) {
                ctx.status(HttpStatus.NOT_FOUND).json(Map.of("code", 0, "error", "user_none"));
                return;
            }

            // Генерація JWT токена
            SecretKey jwtSecretKey = Keys.hmacShaKeyFor(SECRET_KEY.getBytes()); // Перейменував змінну
            String token = Jwts.builder()
                .claim("id_user", user.get("_id"))
                .signWith(jwtSecretKey)
                .compact();

            // Збереження токена
            Map<String, Object> tokensDb = new HashMap<>();
            if (Files.exists(TOKENS_PATH)) {
                tokensDb = objectMapper.readValue(Files.readString(TOKENS_PATH), Map.class);
            }

            if (!tokensDb.containsKey(user.get("_id"))) {
                tokensDb.put(user.get("_id"), new HashMap<>());
            }

            ((Map<String, Object>) tokensDb.get(user.get("_id"))).put(token, true);
            Files.writeString(TOKENS_PATH, objectMapper.writeValueAsString(tokensDb));

            // Шифрування відповіді
            String responseData = "[" + token + ", " + user + "]";
            String encryptedResponse = CryptoUtils.encryptServer(responseData);

            ctx.json(Map.of("code", 1, "data", encryptedResponse));
        } catch (Exception e) {
            ctx.status(HttpStatus.INTERNAL_SERVER_ERROR)
               .json(Map.of("code", 0, "error", "error_server"));
        }
    }

    public void getInfoByJwt(Context ctx) {
        try {
            Map<String, String> requestBody = ctx.bodyAsClass(Map.class);
            String jwtToken = requestBody.get("jwt_token");
            String id = requestBody.get("id");

            if (jwtToken == null || id == null) {
                ctx.status(HttpStatus.BAD_REQUEST).json(Map.of("error", "Відсутній токен або id"));
                return;
            }

            // Валідація токена
            SecretKey key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
            var claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(jwtToken)
                .getBody();

            String userId = claims.get("id_user", String.class);
            if (!userId.equals(id)) {
                ctx.status(HttpStatus.UNAUTHORIZED).json(Map.of("error", "Токен не відповідає користувачу"));
                return;
            }

            // Перевірка наявності токена в базі
            Map<String, Object> tokensDb = objectMapper.readValue(Files.readString(TOKENS_PATH), Map.class);
            Map<String, Object> userTokens = (Map<String, Object>) tokensDb.get(id);
            if (userTokens == null || !userTokens.containsKey(jwtToken)) {
                ctx.status(HttpStatus.UNAUTHORIZED).json(Map.of("error", "Токен не знайдено для користувача"));
                return;
            }

            // Отримання інформації про користувача
            Map<String, Map<String, String>> users = objectMapper.readValue(Files.readString(DB_PATH), Map.class);
            Map<String, String> user = users.get(id);
            if (user == null) {
                ctx.status(HttpStatus.NOT_FOUND).json(Map.of("error", "Користувача не знайдено"));
                return;
            }

            ctx.json(Map.of("status", "good", "user", user));
        } catch (Exception e) {
            ctx.status(HttpStatus.UNAUTHORIZED).json(Map.of("error", "Невірний токен"));
        }
    }
}