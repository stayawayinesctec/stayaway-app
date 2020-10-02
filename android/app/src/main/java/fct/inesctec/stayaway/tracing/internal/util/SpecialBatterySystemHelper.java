package fct.inesctec.stayaway.tracing.internal.util;

import android.os.Build;
import android.util.Log;

import java.util.Arrays;
import java.util.HashSet;

public class SpecialBatterySystemHelper {
    static HashSet<String> manufacturersWithIssues = new HashSet<>(Arrays.asList(
            "samsung",
            "huawei",
            "xiaomi",
            "oppo",
            "vivo",
            "lenovo",
            "sony",
            "asus"
    ));
    static HashSet<String> modelsWithAndroidOne = new HashSet<>(Arrays.asList(
            "2.3",
            "3.1",
            "3.2",
            "4.2",
            "5.1",
            "5.3",
            "6",
            "7 plus",
            "7.1",
            "7.2",
            "8 sirocco",
            "8.1",
            "8.3",
            "mi a2",
            "mi a2 lite",
            "mi a3"
    ));

    public static boolean hasSpecialBatterySystem() {
        // Gets the device model
        String deviceModel = Build.MODEL;

        // Gets the device manufacturer
        String deviceManufacturer = Build.MANUFACTURER;

        // Check if the device manufacturer is marked has
        // one with a special battery optimization system
        if (manufacturersWithIssues.contains(deviceManufacturer.toLowerCase())) {

            // Check if is android one
            return ! modelsWithAndroidOne.contains(deviceModel.toLowerCase());
        }

        return false;
    }
}
