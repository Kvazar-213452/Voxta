package voxta.status;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import io.github.cdimascio.dotenv.Dotenv;
import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

import java.lang.reflect.Type;
import java.net.InetSocketAddress;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class ServerStatus extends WebSocketServer {

    private static final Map<String, WebSocket> onlineUsers = new ConcurrentHashMap<>();
    private static final Map<WebSocket, String> socketToUser = new ConcurrentHashMap<>();

    private static Algorithm jwtAlgorithm;
    private static final Gson gson = new Gson();

    public ServerStatus(int port, String secretKey) {
        super(new InetSocketAddress(port));
        jwtAlgorithm = Algorithm.HMAC256(secretKey);
    }

    @Override
    public void onOpen(WebSocket conn, ClientHandshake handshake) {
        System.out.println("Client connected: " + conn.getRemoteSocketAddress());
    }

    @Override
    public void onClose(WebSocket conn, int code, String reason, boolean remote) {
        String userId = socketToUser.get(conn);
        if (userId != null) {
            onlineUsers.remove(userId);
            socketToUser.remove(conn);
            System.out.println("User disconnected: " + userId);
        }
    }

    @Override
    public void onMessage(WebSocket conn, String message) {
        try {
            Type type = new TypeToken<Map<String, Object>>() {}.getType();
            Map<String, Object> json = gson.fromJson(message, type);
            String action = (String) json.get("type");

            switch (action) {
                case "authenticate" -> {
                    String token = (String) json.get("token");
                    try {
                        DecodedJWT decoded = JWT.require(jwtAlgorithm).build().verify(token);
                        String userId = decoded.getClaim("id_user").asString();

                        onlineUsers.put(userId, conn);
                        socketToUser.put(conn, userId);

                        conn.send(jsonResponse("authenticated", Map.of(
                            "code", 1,
                            "status", "online"
                        )));

                        System.out.println("User authenticated: " + userId);
                    } catch (Exception e) {
                        conn.send(jsonResponse("authenticated", Map.of("code", 0)));
                        conn.close();
                    }
                }

                case "getStatus" -> {
                    String token = (String) json.get("token");
                    String checkId = (String) json.get("id_user");

                    try {
                        JWT.require(jwtAlgorithm).build().verify(token);

                        String status = onlineUsers.containsKey(checkId) ? "online" : "offline";
                        conn.send(jsonResponse("getStatus", Map.of(
                            "code", 1,
                            "status", status
                        )));
                    } catch (Exception e) {
                        conn.send(jsonResponse("getStatus", Map.of(
                            "code", 0,
                            "error", "unauthorized"
                        )));
                    }
                }

                default -> conn.send(jsonResponse("error", Map.of("message", "Unknown message type")));
            }

        } catch (Exception e) {
            e.printStackTrace();
            conn.send(jsonResponse("error", Map.of("message", "Server error")));
        }
    }

    @Override
    public void onError(WebSocket conn, Exception ex) {
        System.err.println("WebSocket error: " + ex.getMessage());
    }

    @Override
    public void onStart() {
        System.out.println("WebSocket server started");
    }

    private String jsonResponse(String type, Map<String, Object> data) {
        data.put("type", type);
        return gson.toJson(data);
    }

    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.load();
        String secret = dotenv.get("SECRET_KEY", "default-secret-key");
        int port = Integer.parseInt(dotenv.get("PORT", "3000"));

        ServerStatus server = new ServerStatus(port, secret);
        server.start();
    }
}
