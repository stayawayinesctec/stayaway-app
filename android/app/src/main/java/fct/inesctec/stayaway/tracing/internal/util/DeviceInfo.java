package fct.inesctec.stayaway.tracing.internal.util;

import android.os.Build;

import fct.inesctec.stayaway.BuildConfig;

public class DeviceInfo {
    private String OSVersion;
    private String deviceModel;
    private String versionName;
    private String versionCode;

    private static DeviceInfo instance;

    private DeviceInfo() {
        this.OSVersion = Integer.toString(Build.VERSION.SDK_INT);
        this.deviceModel = Build.MANUFACTURER + " - " + Build.MODEL;
        this.versionName = BuildConfig.VERSION_NAME;
        this.versionCode = Integer.toString(BuildConfig.VERSION_CODE);
    }

    public static DeviceInfo getInstance() {
        if (instance == null) {
            instance = new DeviceInfo();
        }

        return instance;
    }

    public String getOSVersion() {
        return OSVersion;
    }

    public String getDeviceModel() {
        return deviceModel;
    }

    public String getVersionName() {
        return versionName;
    }

    public String getVersionCode() {
        return versionCode;
    }
}
