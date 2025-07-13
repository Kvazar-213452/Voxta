package voxta.authentication.utils;

import java.util.*;

public class Generate {
    public static String generateSixDigitCode() {
        Random random = new Random();
        int code = 100_000 + random.nextInt(900_000);
        return Integer.toString(code);
    }

    public static String generateId() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 10);
    }
}