/*
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

package fct.inesctec.stayaway.tracing.internal.broadcast;

import android.app.AlarmManager;
import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.SystemClock;

import androidx.core.app.NotificationCompat;

import org.dpppt.android.sdk.DP3T;
import org.dpppt.android.sdk.InfectionStatus;
import org.dpppt.android.sdk.TracingStatus;
import org.dpppt.android.sdk.models.ExposureDay;

import fct.inesctec.stayaway.MainActivity;
import fct.inesctec.stayaway.R;
import fct.inesctec.stayaway.tracing.internal.storage.SecureStorage;
import fct.inesctec.stayaway.tracing.internal.util.NotificationUtil;

public class UpdateEventBroadcastReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        if (! DP3T.ACTION_UPDATE.equals(intent.getAction()))
            return;

        BroadcastHelper.sendUpdateBroadcast(context);

        SecureStorage secureStorage = SecureStorage.getInstance(context);
        TracingStatus status = DP3T.getStatus(context);
        if (status.getInfectionStatus() == InfectionStatus.EXPOSED) {
            ExposureDay exposureDay = null;
            long dateNewest = 0;
            for (ExposureDay day : status.getExposureDays()) {
                if (day.getExposedDate().getStartOfDayTimestamp() > dateNewest) {
                    exposureDay = day;
                    dateNewest = day.getExposedDate().getStartOfDayTimestamp();
                }
            }
            if (exposureDay != null && secureStorage.getLastShownContactId() != exposureDay.getId()) {
                createExposedNotification(context, exposureDay.getId());
            }
        }

        // Schedule sync error for two days from now
        scheduleSyncErrorNotification(context);
    }

    private static void createExposedNotification(Context context, int contactId) {
        SecureStorage secureStorage = SecureStorage.getInstance(context);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationUtil.createNotificationChannel(context);
        }

        Intent resultIntent = new Intent(context, MainActivity.class);
        resultIntent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);

        PendingIntent pendingIntent =
                PendingIntent.getActivity(context, 0, resultIntent, PendingIntent.FLAG_UPDATE_CURRENT);

        Notification notification =
                new NotificationCompat.Builder(context, NotificationUtil.NOTIFICATION_CHANNEL_ID)
                        .setContentTitle(context.getString(R.string.stayaway_covid_service_notification_exposed_title))
                        .setContentText(context.getString(R.string.stayaway_covid_service_notification_exposed_text))
                        .setStyle(new NotificationCompat.BigTextStyle()
                                .bigText(context.getString(R.string.stayaway_covid_service_notification_exposed_text)))
                        .setPriority(NotificationCompat.PRIORITY_MAX)
                        .setSmallIcon(R.drawable.ic_stayaway_logo)
                        .setContentIntent(pendingIntent)
                        .setAutoCancel(true)
                        .build();

        NotificationManager notificationManager =
                (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        notificationManager.notify(NotificationUtil.NOTIFICATION_ID_CONTACT, notification);

        secureStorage.setLastShownContactId(contactId);
    }

    private static void scheduleSyncErrorNotification(Context context) {
        // Cancel previous notification
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        Intent intent = new Intent(context, SyncErrorBroadcastReceiver.class);
        PendingIntent pending = PendingIntent.getBroadcast(context, NotificationUtil.NOTIFICATION_ID_SYNC_ERROR, intent, PendingIntent.FLAG_UPDATE_CURRENT);
        alarmManager.cancel(pending);

        // Create new notification
        long futureTimeMillis = SystemClock.elapsedRealtime() + 1000 * 60 * 60 * 24 * 2; // 2 days

        // Schedule notification
        alarmManager.set(AlarmManager.ELAPSED_REALTIME_WAKEUP, futureTimeMillis, pending);
    }
}
