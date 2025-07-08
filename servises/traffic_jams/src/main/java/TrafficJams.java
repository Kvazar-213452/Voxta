package voxta.traffic;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.corundumstudio.socketio.*;
import com.corundumstudio.socketio.listener.*;
import io.github.cdimascio.dotenv.Dotenv;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class TrafficJams {

    private static final Map<String, SocketIOClient> onlineUsers = new ConcurrentHashMap<>();
    private static final Map<SocketIOClient, String> clientTokens = new ConcurrentHashMap<>();

    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
        String secret = dotenv.get("SECRET_KEY", "your_secret_key");
        int port = Integer.parseInt(dotenv.get("PORT", "3002"));
        Algorithm jwtAlgorithm = Algorithm.HMAC256(secret);

        Configuration config = new Configuration();
        config.setHostname("0.0.0.0");
        config.setPort(port);
        config.setOrigin("*");

        config.setAllowCustomRequests(true);
        config.setUpgradeTimeout(10000);
        config.setPingTimeout(5000);
        config.setPingInterval(25000);

        SocketIOServer server = new SocketIOServer(config);

        server.addConnectListener(client -> {
            System.out.println("Client connected: " + client.getSessionId());
        });

        server.addEventListener("authenticate", Map.class, (client, data, ackSender) -> {
            try {
                String token = (String) data.get("token");
                if (token == null || token.trim().isEmpty()) {
                    throw new RuntimeException("Token is required");
                }

                DecodedJWT decoded = JWT.require(jwtAlgorithm).build().verify(token);
                String userId = decoded.getClaim("id_user").asString();

                if (userId == null || userId.trim().isEmpty()) {
                    throw new RuntimeException("Invalid user ID in token");
                }

                SocketIOClient oldClient = onlineUsers.get(userId);
                if (oldClient != null && !oldClient.getSessionId().equals(client.getSessionId())) {
                    oldClient.disconnect();
                    onlineUsers.remove(userId);
                    clientTokens.remove(oldClient);
                }

                onlineUsers.put(userId, client);
                clientTokens.put(client, token);

                client.set("userId", userId);
                client.set("authenticated", true);

                client.sendEvent("authenticated", Map.of(
                    "code", 1,
                    "status", "online"
                ));
                System.out.println("User authenticated: " + userId);

            } catch (Exception e) {
                System.err.println("Authentication failed: " + e.getMessage());
                client.sendEvent("authenticated", Map.of(
                    "code", 0,
                    "error", "authentication_failed"
                ));
                client.disconnect();
            }
        });

        server.addEventListener("send", Map.class, (client, data, ackSender) -> {
            try {
                Boolean authenticated = client.get("authenticated");
                if (authenticated == null || !authenticated) {
                    client.sendEvent("error", Map.of("error", "not_authenticated"));
                    return;
                }

                Object msgObj = data.get("msg");
                if (!(msgObj instanceof String)) {
                    client.sendEvent("error", Map.of("error", "msg_must_be_string"));
                    return;
                }
                String msg = (String) msgObj;

                Object participantsObj = data.get("participants");
                if (!(participantsObj instanceof List<?>)) {
                    client.sendEvent("error", Map.of("error", "participants_must_be_list"));
                    return;
                }

                List<?> rawParticipants = (List<?>) participantsObj;
                List<String> participants = new ArrayList<>();

                for (Object o : rawParticipants) {
                    if (o instanceof String) {
                        participants.add((String) o);
                    } else {
                        client.sendEvent("error", Map.of("error", "participants_list_must_contain_strings"));
                        return;
                    }
                }

                System.out.println("Sending message from userId: " + client.get("userId"));
                System.out.println("Message: " + msg);
                System.out.println("To participants: " + participants);

                for (String userId : participants) {
                    SocketIOClient receiver = onlineUsers.get(userId);
                    if (receiver != null) {
                        System.out.println("Sending to: " + userId);
                        receiver.sendEvent("message", Map.of(
                            "from", client.get("userId"),
                            "msg", msg
                        ));
                    } else {
                        System.out.println("User " + userId + " is not online");
                    }
                }
            } catch (Exception e) {
                System.err.println("Error handling send event: " + e.getMessage());
                client.sendEvent("error", Map.of("error", "send_failed"));
            }
        });


        server.addDisconnectListener(client -> {
            String userId = client.get("userId");
            if (userId != null) {
                onlineUsers.remove(userId);
                clientTokens.remove(client);
                System.out.println("User disconnected: " + userId);
            }
        });

        server.start();
        System.out.println("Socket.IO server started on port " + port);

        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            System.out.println("Shutting down server...");
            server.stop();
        }));
    }
}
