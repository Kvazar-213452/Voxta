package voxta.authentication.model;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;

public class MongoConnection {
    private static MongoClient client = null;
    private static boolean connected = false;

    private static final String uri = System.getenv("MONGODB_URI") != null
            ? System.getenv("MONGODB_URI")
            : "mongodb://localhost:27017";

    public static synchronized MongoClient getMongoClient() {
        if (!connected) {
            client = MongoClients.create(uri);
            connected = true;
            System.out.println("MongoDB connected");
        }
        return client;
    }
}
