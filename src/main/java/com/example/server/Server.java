package com.example.server;

import io.javalin.Javalin;
import io.javalin.http.staticfiles.Location;

import com.example.Config;

// src/main/java/com/example/server/Server.java

public class Server {
    private static Javalin app;

    public static void startServer() {
        app = Javalin.create(config -> {
            config.staticFiles.add(Config.PhatFrontent + "static/", Location.EXTERNAL);
        }).start(7000);

        // Get
        app.get("/", Rotate.handleRootPath());

        // Post
        app.post("/message", Post.Post_unix());
    }

    public static void stopServer() {
        if (app != null) {
            app.stop();
        }
    }
}