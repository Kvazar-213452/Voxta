package com.example.server;

import io.javalin.http.Handler;
import java.nio.file.Files;
import java.nio.file.Paths;
import com.example.Config;

// src/main/java/com/example/server/Rotate.java

public class Rotate {

    public static Handler handleRootPath() {
        return ctx -> {
            try {
                String filePath = Config.PhatFrontent + "/main.html";
                if (Files.exists(Paths.get(filePath))) {
                    ctx.result(new String(Files.readAllBytes(Paths.get(filePath)))).contentType("text/html");
                } else {
                    ctx.status(404).result("File not found.");
                }
            } catch (Exception e) {
                ctx.status(500).result("Server error: " + e.getMessage());
            }
        };
    }
}