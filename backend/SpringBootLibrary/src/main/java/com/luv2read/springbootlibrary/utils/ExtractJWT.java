package com.luv2read.springbootlibrary.utils;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

public class ExtractJWT {

    public static String payloadJWTExtraction(String token, String extraction){
        token.replace("Bearer", "");

        //Breaking the JWT into three chunks
        //header,payload,signature
        String[] chunk = token.split("\\.");
        Base64.Decoder decoder = Base64.getUrlDecoder();

        String payload = new String(decoder.decode(chunk[1]));

        //after decoding split the JWT by commas
        String[] entries = payload.split(",");

        Map<String,String> map = new HashMap<>();

        for(String entry: entries) {
            String[] keyValue = entry.split(":");
            if (keyValue[0].equals(extraction)) {

                int remove = 1;
                //remove } at the end
                if (keyValue[1].endsWith("}")) {
                    remove = 2;
                }
                keyValue[1] = keyValue[1].substring(0, keyValue[1].length() - remove);
                //remove " at the beginning
                keyValue[1] = keyValue[1].substring(1);
                map.put(keyValue[0], keyValue[1]);
            }
        }
        if(map.containsKey(extraction)){
            return map.get(extraction);
        }
        return null;
    }

}
