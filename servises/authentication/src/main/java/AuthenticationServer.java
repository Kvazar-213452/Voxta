package voxta.authentication;

import io.javalin.Javalin;
import voxta.authentication.handlers.LoginHandler;
import voxta.authentication.handlers.GetInfoToJwtHandler;
import voxta.authentication.handlers.PublicKeyHandler;
import voxta.authentication.handlers.RegisterHandler;
import voxta.authentication.handlers.RegisterVerificationHandler;
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
        GetInfoToJwtHandler.init(SECRET_KEY);
        RegisterHandler.init(SECRET_KEY);
        RegisterVerificationHandler.init(SECRET_KEY);

        // post
        app.post("/login", LoginHandler::handle);
        app.post("/get_info_to_jwt", GetInfoToJwtHandler::handle);
        app.post("/register", RegisterHandler::handle);
        app.post("/register_verification", RegisterVerificationHandler::handle);

        // public
        app.get("/public_key", PublicKeyHandler::handle);
    }
}
