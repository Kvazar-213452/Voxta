package voxta.friend;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import io.github.cdimascio.dotenv.Dotenv;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;

import java.io.*;
import java.net.InetSocketAddress;
import java.security.SecureRandom;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;

public class FriendCode {
    private static final Map<String, String> FriendCodeVal = new ConcurrentHashMap<>();
    private static final String ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private static final int CODE_LENGTH = 16;
    private static final SecureRandom random = new SecureRandom();
    private static final ObjectMapper objectMapper = new ObjectMapper();

    public static void main(String[] args) throws IOException {
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
        int port = Integer.parseInt(dotenv.get("PORT", "3002"));

        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);

        server.createContext("/", new CorsHandler());
        server.createContext("/authenticate", new AuthenticateHandler());
        server.createContext("/add_user", new AddUserHandler());
        server.createContext("/get_id_via_code", new GetIdViaCodeHandler());

        server.setExecutor(Executors.newFixedThreadPool(10));
        server.start();

        System.out.println("HTTP server started on port " + port);

        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            System.out.println("Shutting down server...");
            server.stop(0);
        }));
    }

    static class CorsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");

            if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
                exchange.sendResponseHeaders(200, -1);
                return;
            }

            String response = "Friend Code Server is running";
            exchange.sendResponseHeaders(200, response.getBytes().length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(response.getBytes());
            }
        }
    }

    static class AuthenticateHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            setCorsHeaders(exchange);
            exchange.getResponseHeaders().add("Content-Type", "application/json");

            if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
                exchange.sendResponseHeaders(200, -1);
                return;
            }

            if (!exchange.getRequestMethod().equalsIgnoreCase("POST")) {
                sendErrorResponse(exchange, 405, "Method not allowed");
                return;
            }

            try {
                String requestBody = readRequestBody(exchange);
                Map<String, Object> data = objectMapper.readValue(requestBody, new TypeReference<>() {});

                Object usersObj = data.get("users");
                if (!(usersObj instanceof List<?> usersList)) {
                    sendJsonResponse(exchange, 400, Map.of("code", 0, "error", "invalid_users_format"));
                    return;
                }

                FriendCodeVal.clear();

                Map<String, String> generatedCodes = new HashMap<>();
                for (Object userObj : usersList) {
                    if (userObj instanceof String idUser && !idUser.isBlank()) {
                        String friendCode = generateUniqueCode();
                        FriendCodeVal.put(friendCode, idUser);
                        generatedCodes.put(idUser, friendCode);
                        System.out.println("Assigned code " + friendCode + " to user " + idUser);
                    }
                }

                sendJsonResponse(exchange, 200, Map.of("code", 1));

            } catch (Exception e) {
                System.err.println("Error in authenticate: " + e.getMessage());
                sendJsonResponse(exchange, 500, Map.of("code", 0, "error", "internal_server_error"));
            }
        }
    }

    static class AddUserHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            setCorsHeaders(exchange);
            exchange.getResponseHeaders().add("Content-Type", "application/json");

            if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
                exchange.sendResponseHeaders(200, -1);
                return;
            }

            if (!exchange.getRequestMethod().equalsIgnoreCase("POST")) {
                sendErrorResponse(exchange, 405, "Method not allowed");
                return;
            }

            try {
                String requestBody = readRequestBody(exchange);
                Map<String, Object> data = objectMapper.readValue(requestBody, new TypeReference<>() {});

                Object userObj = data.get("user");
                if (!(userObj instanceof String idUser) || idUser.isBlank()) {
                    sendJsonResponse(exchange, 400, Map.of("code", 0, "error", "invalid_user"));
                    return;
                }

                FriendCodeVal.entrySet().removeIf(entry -> entry.getValue().equals(idUser));

                String friendCode = generateUniqueCode();
                FriendCodeVal.put(friendCode, idUser);
                System.out.println("Added user " + idUser + " with code " + friendCode);

                sendJsonResponse(exchange, 200, Map.of("code", 1, "user", idUser, "codeVal", friendCode));

            } catch (Exception e) {
                System.err.println("Error in add_user: " + e.getMessage());
                sendJsonResponse(exchange, 500, Map.of("code", 0, "error", "internal_server_error"));
            }
        }
    }

    static class GetIdViaCodeHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            setCorsHeaders(exchange);
            exchange.getResponseHeaders().add("Content-Type", "application/json");

            if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
                exchange.sendResponseHeaders(200, -1);
                return;
            }

            if (!exchange.getRequestMethod().equalsIgnoreCase("POST")) {
                sendErrorResponse(exchange, 405, "Method not allowed");
                return;
            }

            try {
                String requestBody = readRequestBody(exchange);
                Map<String, Object> data = objectMapper.readValue(requestBody, new TypeReference<>() {});

                String code = (String) data.get("code");
                if (code == null || code.length() != CODE_LENGTH) {
                    sendJsonResponse(exchange, 400, Map.of("code", 0, "error", "invalid_code"));
                    return;
                }

                String idUser = FriendCodeVal.get(code);
                if (idUser != null) {
                    sendJsonResponse(exchange, 200, Map.of("code", 1, "idUser", idUser));
                } else {
                    sendJsonResponse(exchange, 404, Map.of("code", 0, "error", "code_not_found"));
                }

            } catch (Exception e) {
                System.err.println("Error in get_id_via_code: " + e.getMessage());
                sendJsonResponse(exchange, 500, Map.of("code", 0, "error", "internal_server_error"));
            }
        }
    }

    private static String readRequestBody(HttpExchange exchange) throws IOException {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(exchange.getRequestBody()))) {
            StringBuilder body = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                body.append(line);
            }
            return body.toString();
        }
    }

    private static void sendJsonResponse(HttpExchange exchange, int statusCode, Object responseData) throws IOException {
        String jsonResponse = objectMapper.writeValueAsString(responseData);
        byte[] responseBytes = jsonResponse.getBytes();

        exchange.sendResponseHeaders(statusCode, responseBytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(responseBytes);
        }
    }

    private static void sendErrorResponse(HttpExchange exchange, int statusCode, String message) throws IOException {
        byte[] responseBytes = message.getBytes();
        exchange.sendResponseHeaders(statusCode, responseBytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(responseBytes);
        }
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

    private static void setCorsHeaders(HttpExchange exchange) {
        exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "POST, OPTIONS");
        exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");
    }
}
