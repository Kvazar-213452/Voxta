package voxta.authentication;

import io.javalin.Javalin;
import voxta.authentication.handlers.LoginHandler;
import voxta.authentication.handlers.PublicKeyHandler;
import io.github.cdimascio.dotenv.Dotenv;

public class AuthenticationServer {
    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.load();
        String SECRET_KEY = dotenv.get("SECRET_KEY");

        try {
            voxta.authentication.utils.crypto.KeyGeneratorUtil.generateKeys();
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Failed to initialize keys: " + e.getMessage());
            return;
        }
        
        Javalin app = Javalin.create().start(3000);

        LoginHandler.init(SECRET_KEY);

        app.post("/login", LoginHandler::handle);
        app.get("/public_key", PublicKeyHandler::handle);
    }
}
