package com.example;

import io.javalin.Javalin;
import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.web.WebView;
import javafx.scene.web.WebEngine;
import javafx.stage.Stage;

public class WebViewApp extends Application {
    private static Javalin app;

    public static void main(String[] args) {
        new Thread(() -> {
            app = Javalin.create().start(7000);
            app.get("/", ctx -> ctx.result("Hello from Javalin!"));
        }).start();

        launch(args);
    }

    @Override
    public void start(Stage primaryStage) {
        WebView webView = new WebView();
        WebEngine webEngine = webView.getEngine();

        webEngine.load("http://localhost:7000");

        Scene scene = new Scene(webView, 800, 600);
        primaryStage.setScene(scene);
        primaryStage.setTitle("JavaFX WebView with Javalin");

        primaryStage.setOnCloseRequest(event -> {
            app.stop();
            System.exit(0);
        });

        primaryStage.show();
    }
}
