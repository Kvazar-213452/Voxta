package voxta.authentication;

import io.javalin.Javalin;
import java.io.File;
import java.nio.file.Paths;

public class Server {
    private static final int PORT = 3000;

    public static void main(String[] args) {
        Javalin app = Javalin.create(config -> {}).start(PORT);

        // Ініціалізація контролерів
        AuthController authController = new AuthController();
        PublicController publicController = new PublicController();

        // Маршрути
        app.post("/login", authController::login);
        app.post("/get_info_to_jwt", authController::getInfoByJwt);
        app.get("/public_key", publicController::getPublicKey);

        // Перевірка наявності ключів при запуску
        File privateKeyFile = Paths.get("private_key.pem").toFile();
        File publicKeyFile = Paths.get("public_key.pem").toFile();
        
        if (!privateKeyFile.exists() || !publicKeyFile.exists()) {
            CryptoUtils.generateKeys();
        }
    }
}