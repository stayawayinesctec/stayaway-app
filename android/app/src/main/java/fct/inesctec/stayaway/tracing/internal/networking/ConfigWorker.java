/*
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

/*
 * Copyright (c) 2020 Ubique Innovation AG <https://www.ubique.ch>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * SPDX-License-Identifier: MPL-2.0
 */

package fct.inesctec.stayaway.tracing.internal.networking;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;

import androidx.annotation.NonNull;
import androidx.core.app.NotificationCompat;
import androidx.work.Constraints;
import androidx.work.ExistingPeriodicWorkPolicy;
import androidx.work.NetworkType;
import androidx.work.PeriodicWorkRequest;
import androidx.work.WorkManager;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

import com.g00fy2.versioncompare.Version;

import org.dpppt.android.sdk.DP3T;
import org.dpppt.android.sdk.backend.SignatureException;
import org.dpppt.android.sdk.internal.logger.Logger;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

import fct.inesctec.stayaway.BuildConfig;
import fct.inesctec.stayaway.MainActivity;
import fct.inesctec.stayaway.R;
import fct.inesctec.stayaway.tracing.internal.networking.errors.ResponseError;
import fct.inesctec.stayaway.tracing.internal.networking.models.ConfigResponseModel;
import fct.inesctec.stayaway.tracing.internal.networking.models.InfoBoxModel;
import fct.inesctec.stayaway.tracing.internal.networking.models.VersionModel;
import fct.inesctec.stayaway.tracing.internal.storage.SecureStorage;
import fct.inesctec.stayaway.tracing.internal.util.NotificationUtil;

public class ConfigWorker extends Worker {

    private static final int REPEAT_INTERVAL_CONFIG_DAYS = 1;
    private static final long MAX_AGE_OF_CONFIG_FOR_RELOAD_AT_APP_START = 2  * 24 * 60 * 60 * 1000L; // 2 days

    private static final String TAG = "ConfigWorker";
    private static final String WORK_TAG = "fct.inesctec.stayaway.ConfigWorker";

    public static void scheduleConfigWorkerIfOutdated(Context context) {
        SecureStorage secureStorage = SecureStorage.getInstance(context);
		if (secureStorage.getLastConfigLoadSuccess() < System.currentTimeMillis() - MAX_AGE_OF_CONFIG_FOR_RELOAD_AT_APP_START ||
				secureStorage.getLastConfigLoadSuccessAppVersion() != BuildConfig.VERSION_CODE ||
				secureStorage.getLastConfigLoadSuccessSdkInt() != Build.VERSION.SDK_INT) {
			Constraints constraints = new Constraints.Builder()
					.setRequiredNetworkType(NetworkType.CONNECTED)
					.build();

			PeriodicWorkRequest periodicWorkRequest =
					new PeriodicWorkRequest.Builder(ConfigWorker.class, REPEAT_INTERVAL_CONFIG_DAYS, TimeUnit.DAYS)
							.setConstraints(constraints)
							.build();

			WorkManager workManager = WorkManager.getInstance(context);
			workManager.enqueueUniquePeriodicWork(WORK_TAG, ExistingPeriodicWorkPolicy.REPLACE, periodicWorkRequest);
		}
    }

    public ConfigWorker(@NonNull Context context, @NonNull WorkerParameters workerParams) {
        super(context, workerParams);
    }

    @NonNull
    @Override
    public Result doWork() {
        Logger.d(TAG, "started");
        DP3T.addWorkerStartedToHistory(getApplicationContext(), "config");
        try {
            loadConfig();
        } catch (IOException | ResponseError | SignatureException e) {
            Logger.e(TAG, "failed", e);
            return Result.retry();
        }

        Logger.d(TAG, "finished with success");
        return Result.success();
    }

    public void loadConfig() throws IOException, ResponseError, SignatureException {
        Context context = getApplicationContext();

        ConfigRepository configRepository = new ConfigRepository(context);
        ConfigResponseModel config = configRepository.getConfig();

        if (this.shouldBroadcastUpdateNotification(config.getVersion())) {
            createUpdateNotification(context);
        } else {
            cancelUpdateNotification(context);
        }

        // Update matching parameters
        DP3T.setMatchingParameters(context,
                config.getParameters().getLowerThreshold(), config.getParameters().getHigherThreshold(),
                config.getParameters().getFactorLow(), config.getParameters().getFactorHigh(),
                config.getParameters().getTriggerThreshold());

        // Check InfoBox
        SecureStorage secureStorage = SecureStorage.getInstance(context);
        InfoBoxModel info = config.getInfoBox(context.getString(R.string.language_key));
        if (info != null && (info.getId() == null || !info.getId().equals(secureStorage.getInfoboxId()))) {
            // Only update the InfoBox if it has a new ID.
            secureStorage.setInfoboxTitle(info.getTitle());
            secureStorage.setInfoboxText(info.getText());
            secureStorage.setInfoboxLink(info.getUrl());
            secureStorage.setInfoboxId(info.getId());

            createInfoBoxNotification(context);
        }
    }

    private void createUpdateNotification(Context context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationUtil.createNotificationChannel(context);
        }

        String packageName = context.getPackageName();
        Intent intent = new Intent(Intent.ACTION_VIEW);
        intent.setData(Uri.parse("market://details?id=" + packageName));
        PendingIntent pendingIntent =
                PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);

        Notification notification =
                new NotificationCompat.Builder(context, NotificationUtil.NOTIFICATION_CHANNEL_ID)
                        .setContentTitle(context.getString(R.string.stayaway_covid_service_notification_update_title))
                        .setContentText(context.getString(R.string.stayaway_covid_service_notification_update_text))
                        .setStyle(new NotificationCompat.BigTextStyle()
                                .bigText(context.getString(R.string.stayaway_covid_service_notification_update_text)))
                        .setPriority(NotificationCompat.PRIORITY_MAX)
                        .setSmallIcon(R.drawable.ic_stayaway_logo)
                        .setContentIntent(pendingIntent)
                        .setAutoCancel(true)
                        .build();

        NotificationManager notificationManager =
                (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        notificationManager.notify(NotificationUtil.NOTIFICATION_ID_UPDATE, notification);
    }

    private void createInfoBoxNotification(Context context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationUtil.createNotificationChannel(context);
        }

        SecureStorage secureStorage = SecureStorage.getInstance(context);
        Intent resultIntent;

        if (secureStorage.getInfoboxLink() != null) {
            resultIntent = new Intent(Intent.ACTION_VIEW);
            resultIntent.setData(Uri.parse(secureStorage.getInfoboxLink()));
        } else {
            resultIntent = new Intent(context, MainActivity.class);
            resultIntent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);
        }

        PendingIntent pendingIntent =
                PendingIntent.getActivity(context, 0, resultIntent, PendingIntent.FLAG_UPDATE_CURRENT);

        Notification notification =
                new NotificationCompat.Builder(context, NotificationUtil.NOTIFICATION_CHANNEL_ID)
                        .setContentTitle(secureStorage.getInfoboxTitle())
                        .setContentText(secureStorage.getInfoboxText())
                        .setStyle(new NotificationCompat.BigTextStyle()
                                .bigText(secureStorage.getInfoboxText()))
                        .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                        .setSmallIcon(R.drawable.ic_stayaway_logo)
                        .setContentIntent(pendingIntent)
                        .setAutoCancel(true)
                        .build();

        NotificationManager notificationManager =
                (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        notificationManager.notify(NotificationUtil.NOTIFICATION_ID_INFOBOX, notification);
    }

    private void cancelUpdateNotification(Context context) {
        NotificationManager notificationManager =
                (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        notificationManager.cancel(NotificationUtil.NOTIFICATION_ID_UPDATE);
    }

    private boolean shouldBroadcastUpdateNotification(VersionModel config) {
        Version lastVersion = new Version(config.getName());
        int lastBuild = Integer.parseInt(config.getBuild());
        Version currentVersion = new Version(BuildConfig.VERSION_NAME);
        int currentBuild = BuildConfig.VERSION_CODE;

        if (lastVersion.isHigherThan(currentVersion)) {
            return true;
        }

        if (lastVersion.isEqual(currentVersion)) {
            return lastBuild > currentBuild;
        }

        return false;
    }
}
