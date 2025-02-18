package com.example.server;

import io.javalin.Javalin;

import java.nio.file.Files;
import java.nio.file.Paths;

import com.example.Config;

public class Server {
    private static Javalin app;

    public static void startServer() {
        app = Javalin.create().start(7000);

        app.get("/", ctx -> {
            try {
                String filePath = Config.PhatFrontent + "main.html";
                if (Files.exists(Paths.get(filePath))) {
                    ctx.result(new String(Files.readAllBytes(Paths.get(filePath)))).contentType("text/html");
                } else {
                    ctx.status(404).result("File not found.");
                }
            } catch (Exception e) {
                ctx.status(500).result("Server error: " + e.getMessage());
            }
        });
    }

    public static void stopServer() {
        app.stop();
    }
}
