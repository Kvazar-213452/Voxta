package voxta.friend;

import com.corundumstudio.socketio.*;
import com.corundumstudio.socketio.listener.*;
import io.github.cdimascio.dotenv.Dotenv;

import java.security.SecureRandom;
import java.util.*;
import java.util.concurrent.*;

public class FriendCode {

    private static final Map<String, String> FriendCodeVal = new ConcurrentHashMap<>();
    private static final Map<String, SocketIOClient> onlineUsers = new ConcurrentHashMap<>();

    private static final String ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private static final int CODE_LENGTH = 16;
    private static final SecureRandom random = new SecureRandom();

    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
        int port = Integer.parseInt(dotenv.get("PORT", "3002"));

        Configuration config = new Configuration();
        config.setHostname("0.0.0.0");
        config.setPort(port);
        config.setOrigin("*");

        SocketIOServer server = new SocketIOServer(config);

        server.addConnectListener(client -> {
            System.out.println("Client connected: " + client.getSessionId());
        });

        // authenticate: { users: ["id1", "id2", ...] }
        server.addEventListener("authenticate", Map.class, (client, data, ackSender) -> {
            Object usersObj = data.get("users");
            if (!(usersObj instanceof List<?> usersList)) {
                client.sendEvent("authenticated", Map.of("code", 0, "error", "invalid_users_format"));
                return;
            }

            Map<String, String> generatedCodes = new HashMap<>();

            for (Object userObj : usersList) {
                if (userObj instanceof String idUser && !idUser.isBlank()) {
                    String friendCode = generateUniqueCode();
                    FriendCodeVal.put(friendCode, idUser);
                    onlineUsers.put(idUser, client);  // optionally track who is online
                    generatedCodes.put(idUser, friendCode);
                    System.out.println("Assigned code " + friendCode + " to user " + idUser);
                }
            }

            client.sendEvent("authenticated", Map.of("code", 1, "codes", generatedCodes));
        });

        // get_id_via_code: { code: "16char_code" }
        server.addEventListener("get_id_via_code", Map.class, (client, data, ackSender) -> {
            String code = (String) data.get("code");
            if (code == null || code.length() != CODE_LENGTH) {
                client.sendEvent("get_id_via_code_response", Map.of("code", 0, "error", "invalid_code"));
                return;
            }

            String idUser = FriendCodeVal.get(code);
            if (idUser != null) {
                client.sendEvent("get_id_via_code_response", Map.of("code", 1, "idUser", idUser));
            } else {
                client.sendEvent("get_id_via_code_response", Map.of("code", 0, "error", "code_not_found"));
            }
        });

        server.addDisconnectListener(client -> {
            System.out.println("Client disconnected: " + client.getSessionId());
        });

        server.start();
        System.out.println("Socket.IO server started on port " + port);

        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            System.out.println("Shutting down server...");
            server.stop();
        }));
    }

    private static String generateUniqueCode() {
        StringBuilder sb = new StringBuilder();
        while (true) {
            sb.setLength(0);
            for (int i = 0; i < CODE_LENGTH; i++) {
                sb.append(ALPHABET.charAt(random.nextInt(ALPHABET.length())));
            }
            String code = sb.toString();
            if (!FriendCodeVal.containsKey(code)) {
                return code;
            }
        }
    }
}
