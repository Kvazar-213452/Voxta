package voxta.authentication.handlers;

import io.javalin.http.Context;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;

public class PublicKeyHandler {
    public static void handle(Context ctx) {
        try {
            File file = new File("public_key.pem");
            if (!file.exists()) {
                ctx.status(404).result("File not found");
                return;
            }

            InputStream inputStream = new FileInputStream(file);
            ctx.contentType("application/x-pem-file");
            ctx.result(inputStream);
        } catch (Exception e) {
            e.printStackTrace();
            ctx.status(500).result("Error reading file: " + e.getMessage());
        }
    }
}
