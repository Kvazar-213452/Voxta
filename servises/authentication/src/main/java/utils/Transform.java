package voxta.authentication.utils;

import org.bson.Document;
import java.util.Map;
import java.util.HashMap;

public class Transform {
    public static Map<String, Object> transformUser(Document userDoc) {
        Map<String, Object> user = new HashMap<>();
        user.put("id", userDoc.getString("_id"));
        user.put("name", userDoc.getString("name"));
        user.put("password", userDoc.getString("password"));
        user.put("time", userDoc.getString("time"));
        user.put("avatar", userDoc.getString("avatar"));
        user.put("desc", userDoc.getString("desc"));
        user.put("chats", userDoc.get("chats"));

        return user;
    }
}
