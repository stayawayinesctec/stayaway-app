/*
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

package fct.inesctec.stayaway.tracing;

import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.google.android.gms.common.api.ApiException;

import org.dpppt.android.sdk.DP3T;
import org.dpppt.android.sdk.TracingStatus;
import org.dpppt.android.sdk.backend.ResponseCallback;
import org.dpppt.android.sdk.internal.logger.LogLevel;
import org.dpppt.android.sdk.internal.logger.Logger;
import org.dpppt.android.sdk.internal.util.LocationServiceUtil;
import org.dpppt.android.sdk.models.ApplicationInfo;
import org.dpppt.android.sdk.models.ExposeeAuthMethodAuthorization;
import org.dpppt.android.sdk.util.SignatureUtil;

import java.net.UnknownHostException;
import java.security.PublicKey;
import java.util.Date;
import java.util.concurrent.CancellationException;

import fct.inesctec.stayaway.BuildConfig;
import fct.inesctec.stayaway.tracing.internal.broadcast.UpdateEventBroadcastReceiver;
import fct.inesctec.stayaway.tracing.internal.networking.AuthCodeRepository;
import fct.inesctec.stayaway.tracing.internal.networking.CertificatePinning;
import fct.inesctec.stayaway.tracing.internal.networking.ConfigWorker;
import fct.inesctec.stayaway.tracing.internal.networking.FakeWorker;
import fct.inesctec.stayaway.tracing.internal.networking.errors.InvalidCodeError;
import fct.inesctec.stayaway.tracing.internal.networking.errors.ResponseError;
import fct.inesctec.stayaway.tracing.internal.networking.models.AuthenticationCodeRequestModel;
import fct.inesctec.stayaway.tracing.internal.networking.models.AuthenticationCodeResponseModel;
import fct.inesctec.stayaway.tracing.internal.storage.SecureStorage;
import fct.inesctec.stayaway.tracing.internal.util.DeviceFeatureHelper;
import fct.inesctec.stayaway.tracing.internal.util.JwtUtil;
import fct.inesctec.stayaway.tracing.internal.util.WritableMapHelper;

public class TracingManagerModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;
    private static SecureStorage secureStorage;

    private static final String TAG = "TracingManager";

    private static final int REQUEST_IGNORE_BATTERY_OPTIMIZATIONS_CODE = 420;
    private static final int REQUEST_LOCATION_SERVICE_CODE = 510;
    private static final int REQUEST_BLUETOOTH_SERVICE_CODE = 330;

    private static final long TIMEOUT_VALID_CODE = 1000L * 60 * 5;

    public static final String UPDATE_EVENT = "fct.inesctec.stayaway.android.sdk.UPDATE_EVENT";

    private static final String BATTERY_PERMISSION_GRANTED = "BATTERY_PERMISSION_GRANTED";
    private static final String BATTERY_PERMISSION_DENIED = "BATTERY_PERMISSION_DENIED";
    private static final String LOCATION_SERVICE_GRANTED = "LOCATION_SERVICE_GRANTED";
    private static final String LOCATION_SERVICE_DENIED = "LOCATION_SERVICE_DENIED";
    private static final String BLUETOOTH_SERVICE_GRANTED = "BLUETOOTH_SERVICE_GRANTED";
    private static final String BLUETOOTH_SERVICE_DENIED = "BLUETOOTH_SERVICE_DENIED";

    private static final String EN_SUCCEEDED = "EN_SUCCEEDED";
    private static final String EN_FAILED = "EN_FAILED";
    private static final String EN_CANCELLED = "EN_CANCELLED";

    private static final Integer UNKNOWN_HOST_EXCEPTION = 13;
    private static final Integer UNKNOWN_EXCEPTION = 14;
    private static final Integer INVALID_CODE_EXCEPTION = 15;

    private static Promise pendingBatteryPromise;
    private static Promise pendingLocationPromise;
    private static Promise pendingBluetoothPromise;

    private static BroadcastReceiver updateEventBroadcasterReceiver;

    TracingManagerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        TracingManagerModule.reactContext = reactContext;
    }

    public static ReactContext getReactContext() {
        return TracingManagerModule.reactContext;
    }

    @Override
    public String getName() {
        return "TracingManager";
    }

    /**
     * Init tracing sdk.
     */
    public static void init(Context context) {
        if (BuildConfig.IS_RELEASE.equals("FALSE")) {
            Logger.init(context, LogLevel.DEBUG);
            CertificatePinning.initDebug(context);
        }

        // Create listeners
        updateEventBroadcasterReceiver = new UpdateEventBroadcastReceiver();

        // Register listeners
        context.registerReceiver(
                updateEventBroadcasterReceiver,
                DP3T.getUpdateIntentFilter()
        );

        initDP3T(context);

        secureStorage = SecureStorage.getInstance(context);

        if (BuildConfig.IS_RELEASE.equals("TRUE") && BuildConfig.IS_UI.equals("FALSE")) {
            FakeWorker.safeStartFakeWorker(context);
            ConfigWorker.scheduleConfigWorkerIfOutdated(context);
        }

        Log.d(TAG, "Tracing Manager initiated");
    }

    public static void initDP3T(Context context) {
        PublicKey publicKey = SignatureUtil.getPublicKeyFromBase64OrThrow(BuildConfig.BACKEND_PUBLIC_KEY);

        ApplicationInfo applicationInfo = new ApplicationInfo(context.getPackageName(), BuildConfig.BACKEND_REPORT_URL, BuildConfig.BACKEND_BUCKET_URL);
        DP3T.init(context, applicationInfo, publicKey, BuildConfig.DEV_HISTORY.equals("TRUE"));

        DP3T.setCertificatePinner(CertificatePinning.getCertificatePinner());
        DP3T.setUserAgent(context.getPackageName() + ";" + BuildConfig.VERSION_NAME + ";" + BuildConfig.BUILD_TIME + ";Android;" +
                Build.VERSION.SDK_INT);
    }

    /**
     * Terminate tracing sdk.
     */
    public static void terminate(Context context) {
        context.unregisterReceiver(updateEventBroadcasterReceiver);
    }

    /**
     * Starts Bluetooth tracing.
     */
    @ReactMethod
    public void start(final Promise promise) {
        DP3T.start(getCurrentActivity(),
                () -> {
                    Log.d(TAG, "EN started");
                    promise.resolve(EN_SUCCEEDED);
                },
                (e) -> {
                    Log.d(TAG, "EN failed: " + e.getClass().getSimpleName() + ": " + e.getMessage());
                    promise.reject(EN_FAILED, "EN failed: " + e.getClass().getSimpleName() + ": " + e.getMessage());
                },
                () -> {
                    Log.d(TAG, "EN cancelled");
                    promise.resolve(EN_CANCELLED);
                }
        );
    }

    /**
     * Stops Bluetooth tracing.
     */
    @ReactMethod
    public void stop(Promise promise) {
        DP3T.stop(TracingManagerModule.reactContext);
        promise.resolve(null);
    }

    /**
     * Pro-actively triggers sync with backend to refresh exposed list.
     */
    @ReactMethod
    public void sync(Promise promise) {
        DP3T.sync(TracingManagerModule.reactContext);
        promise.resolve(null);
    }

    /**
     * Returns a TracingStatus-Object describing the current state.
     *
     * @example
     * {
     *     tracingEnabled : boolean
     *     lastSyncDate : long
     *     infectionStatus : int
     *     exposureDays : List<ExposureDay>
     *     errors (permission, bluetooth disabled, no network, ...) : List<ErrorState>
     * }
     */
    @ReactMethod
    public void getStatus(Promise promise) {
        TracingStatus status = DP3T.getStatus(TracingManagerModule.reactContext);

        WritableMap writableMap = WritableMapHelper.wrapTracingStatus(status);

        promise.resolve(writableMap);
    }

    /**
     * This method must be called upon positive test.
     *
     * @param authCode
     */
    @ReactMethod
    public void exposed(String authCode, final Promise promise) {
        long lastTimestamp = secureStorage.getLastInformRequestTime();
        String lastAuthToken = secureStorage.getLastInformToken();

        if (System.currentTimeMillis() - lastTimestamp < TIMEOUT_VALID_CODE && lastAuthToken != null) {
            Date onsetDate = JwtUtil.getOnsetDate(lastAuthToken);
            informExposed(onsetDate, getAuthorizationHeader(lastAuthToken), promise);
        } else {
            authenticateInput(authCode, promise);
        }
    }

    /**
     * Reset infection status.
     */
    @ReactMethod
    public void resetInfectionStatus(Promise promise) {
        boolean resettable = DP3T.getIAmInfectedIsResettable(reactContext);

        if (resettable) {
            DP3T.resetInfectionStatus(TracingManagerModule.reactContext);
        }

        promise.resolve(resettable);
    }

    /**
     * Check if battery optimization is disabled.
     */
    @ReactMethod
    public void isIgnoringBatteryOptimizationsPermission(Promise promise) {
        boolean batteryOptDeactivated = DeviceFeatureHelper.isBatteryOptimizationDeactivated(TracingManagerModule.reactContext);

        promise.resolve(batteryOptDeactivated);
    }

    /**
     * Request to disable battery optimization.
     */
    @ReactMethod
    public void requestIgnoreBatteryOptimizationsPermission(Promise promise) {
        Activity currentActivity = getCurrentActivity();

        // Store the promise to resolve/reject when permission request returns
        TracingManagerModule.pendingBatteryPromise = promise;

        Intent intent = new Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS,
                Uri.parse("package:" + TracingManagerModule.reactContext.getPackageName()));

        if (intent.resolveActivity(TracingManagerModule.reactContext.getPackageManager()) != null) {
            currentActivity.startActivityForResult(intent, REQUEST_IGNORE_BATTERY_OPTIMIZATIONS_CODE, null);
        }
    }

    /**
     * Check if location is enabled.
     */
    @ReactMethod
    public void isLocationServiceEnabled(Promise promise) {
        boolean locationEnabled = LocationServiceUtil.isLocationEnabled(TracingManagerModule.reactContext);

        promise.resolve(locationEnabled);
    }

    /**
     * Request access to location.
     */
    @ReactMethod
    public void requestLocationService(Promise promise) {
        Activity currentActivity = getCurrentActivity();

        // Store the promise to resolve/reject when permission request returns
        TracingManagerModule.pendingLocationPromise = promise;

        Intent intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
        if (intent.resolveActivity(TracingManagerModule.reactContext.getPackageManager()) != null) {
            currentActivity.startActivityForResult(intent, REQUEST_LOCATION_SERVICE_CODE, null);
        }
    }

    /**
     * Check if bluetooth is enabled.
     */
    @ReactMethod
    public void isBluetoothServiceEnabled(Promise promise) {
        boolean bluetoothEnabled = DeviceFeatureHelper.isBluetoothEnabled();

        promise.resolve(bluetoothEnabled);
    }

    /**
     * Request access to bluetooth.
     */
    @ReactMethod
    public void requestBluetoothService(Promise promise) {
        Activity currentActivity = getCurrentActivity();

        // Store the promise to resolve/reject when permission request returns
        TracingManagerModule.pendingBluetoothPromise = promise;

        Intent intent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
        if (intent.resolveActivity(TracingManagerModule.reactContext.getPackageManager()) != null) {
            currentActivity.startActivityForResult(intent, REQUEST_BLUETOOTH_SERVICE_CODE, null);
        }
    }

    /**
     * Check GAEN availability.
     */
    @ReactMethod
    public void checkGAENAvailability(Promise promise) {
        DP3T.checkGaenAvailability(reactContext, gaenAvailability -> promise.resolve(gaenAvailability.ordinal()));
    }

    /**
     * Request GAEN.
     */
    @ReactMethod
    public void openPlayServicesInPlayStore(Promise promise) {
        final String playServicesPackageName = "com.google.android.gms";
        Activity currentActivity = getCurrentActivity();
        try {
            currentActivity.startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse("market://details?id=" + playServicesPackageName)));
            promise.resolve(null);
        } catch (android.content.ActivityNotFoundException e) {
            currentActivity.startActivity(new Intent(Intent.ACTION_VIEW,
                    Uri.parse("https://play.google.com/store/apps/details?id=" + playServicesPackageName)));
            promise.resolve(null);
        }
    }

    public static void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == REQUEST_IGNORE_BATTERY_OPTIMIZATIONS_CODE) {
            if (TracingManagerModule.pendingBatteryPromise != null) {
                if (resultCode == Activity.RESULT_OK) {
                    TracingManagerModule.pendingBatteryPromise.resolve(BATTERY_PERMISSION_GRANTED);
                } else if (resultCode == Activity.RESULT_CANCELED) {
                    TracingManagerModule.pendingBatteryPromise.reject(BATTERY_PERMISSION_DENIED, "Permission for ignoring battery optimization denied.");
                }
            }

        } else if (requestCode == REQUEST_LOCATION_SERVICE_CODE) {
            if (TracingManagerModule.pendingLocationPromise != null) {
                if (resultCode == Activity.RESULT_OK) {
                    TracingManagerModule.pendingLocationPromise.resolve(LOCATION_SERVICE_GRANTED);
                } else if (resultCode == Activity.RESULT_CANCELED) {
                    TracingManagerModule.pendingLocationPromise.reject(LOCATION_SERVICE_DENIED, "Permission for location access denied.");
                }
            }

        } else if (requestCode == REQUEST_BLUETOOTH_SERVICE_CODE) {
            if (TracingManagerModule.pendingBluetoothPromise != null) {
                if (resultCode == Activity.RESULT_OK) {
                    TracingManagerModule.pendingBluetoothPromise.resolve(BLUETOOTH_SERVICE_GRANTED);
                } else if (resultCode == Activity.RESULT_CANCELED) {
                    TracingManagerModule.pendingBluetoothPromise.reject(BLUETOOTH_SERVICE_DENIED, "Permission for bluetooth access denied.");
                }
            }
        }
    }

    private void informExposed(Date onsetDate, String authorizationHeader, Promise promise) {
        DP3T.sendIAmInfected(getCurrentActivity(),
                onsetDate,
                new ExposeeAuthMethodAuthorization(authorizationHeader),
                new ResponseCallback<Void>() {
                    @Override
                    public void onSuccess(Void response) {
                        Log.d(TAG, "Exposed success");
                        secureStorage.clearInformTimeAndCodeAndToken();

                        promise.resolve(response);
                    }

                    @Override
                    public void onError(Throwable throwable) {
                        throwable.printStackTrace();
                        Log.d(TAG, "Exposed failed: " + throwable.getClass().getSimpleName() + ": " + throwable.getMessage());

                        if (throwable instanceof CancellationException) {
                            promise.resolve(EN_CANCELLED);
                        } else if (throwable instanceof ResponseError) {
                            promise.reject(UNKNOWN_EXCEPTION.toString(), UNKNOWN_EXCEPTION.toString());
                        } else if (throwable instanceof CancellationException) {
                            promise.reject(EN_CANCELLED, EN_CANCELLED);
                        } else if (throwable instanceof ApiException) {
                            promise.reject(UNKNOWN_EXCEPTION.toString(), UNKNOWN_EXCEPTION.toString());
                        } else {
                            promise.reject(UNKNOWN_EXCEPTION.toString(), UNKNOWN_EXCEPTION.toString());
                        }
                    }
                }
        );
    }

    private void authenticateInput(String authCode, Promise promise) {
        AuthCodeRepository authCodeRepository = new AuthCodeRepository(reactContext);
        authCodeRepository.getAccessToken(new AuthenticationCodeRequestModel(authCode, 0),
                new ResponseCallback<AuthenticationCodeResponseModel>() {
                    @Override
                    public void onSuccess(AuthenticationCodeResponseModel response) {
                        String accessToken = response.getAccessToken();

                        secureStorage.saveInformTimeAndCodeAndToken(authCode, accessToken);

                        Date onsetDate = JwtUtil.getOnsetDate(accessToken);
                        if (onsetDate == null) {
                            promise.reject(UNKNOWN_EXCEPTION.toString(), "Invalid auth code response");
                            return;
                        }
                        informExposed(onsetDate, getAuthorizationHeader(accessToken), promise);
                    }

                    @Override
                    public void onError(Throwable throwable) {
                        throwable.printStackTrace();
                        Log.d(TAG, "AuthenticateInput failed: " + throwable.getClass().getSimpleName() + ": " + throwable.getMessage());
                        if (throwable instanceof InvalidCodeError) {
                            promise.reject(INVALID_CODE_EXCEPTION.toString(), INVALID_CODE_EXCEPTION.toString());
                        } else if (throwable instanceof UnknownHostException) {
                            promise.reject(UNKNOWN_HOST_EXCEPTION.toString(), UNKNOWN_HOST_EXCEPTION.toString());
                        } else {
                            promise.reject(UNKNOWN_EXCEPTION.toString(), UNKNOWN_EXCEPTION.toString());
                        }
                    }
                });
    }

    /**
     * Get formatted authorization token.
     *
     * @param accessToken The authentication code to be wrapped in the header
     *
     * @return String
     */
    private String getAuthorizationHeader(String accessToken) {
		return "Bearer " + accessToken;
	}
}
