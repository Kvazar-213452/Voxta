package com.example.server;

import io.javalin.http.Handler;

// src/main/java/com/example/server/Post.java

public class Post {

    public static Handler Post_unix() {
        return ctx -> {
            System.out.println("POST request received!");
            try {
                Message message = ctx.bodyAsClass(Message.class);
                String msg = message.getMsg();
                System.out.println("Received message: " + msg);
                ctx.status(200).result("Message received!");
            } catch (Exception e) {
                System.out.println("Error: " + e.getMessage());
                ctx.status(500).result("Server error: " + e.getMessage());
            }
        };
    }
}