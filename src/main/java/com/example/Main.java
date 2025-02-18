package com.example;

import com.example.server.Server;

import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.web.WebView;
import javafx.scene.web.WebEngine;
import javafx.stage.Stage;

public class Main extends Application {
    public static void main(String[] args) {
        new Thread(() -> Server.startServer()).start();
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
            Server.stopServer();
            System.exit(0);
        });

        primaryStage.show();
    }
}
