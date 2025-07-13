package voxta.authentication.utils;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.*;
import org.json.JSONObject;
import voxta.authentication.Config;

public class SendNotification {
    public static void sendNotification(String code, String gmail) {
        try {
            URL url = new URL(Config.SERVIS_NOTIFICATION + "/send_gmail");
            HttpURLConnection con = (HttpURLConnection) url.openConnection();

            con.setRequestMethod("POST");
            con.setRequestProperty("Content-Type", "application/json");
            con.setDoOutput(true);

            JSONObject payload = new JSONObject();
            payload.put("data", List.of(code, gmail));

            try (OutputStream os = con.getOutputStream()) {
                byte[] input = payload.toString().getBytes("utf-8");
                os.write(input, 0, input.length);
            }

            int responseCode = con.getResponseCode();
            if (responseCode != 200) {
                System.err.println("Failed to send notification, status code: " + responseCode);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}