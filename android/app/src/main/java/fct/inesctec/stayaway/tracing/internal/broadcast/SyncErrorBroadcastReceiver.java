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

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;

import androidx.core.app.NotificationCompat;

import fct.inesctec.stayaway.MainActivity;
import fct.inesctec.stayaway.R;
import fct.inesctec.stayaway.tracing.internal.util.NotificationUtil;

public class SyncErrorBroadcastReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        createSyncErrorNotification(context);
    }

    private static void createSyncErrorNotification(Context context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationUtil.createNotificationChannel(context);
        }

        Intent resultIntent = new Intent(context, MainActivity.class);
        resultIntent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);

        PendingIntent pendingIntent =
                PendingIntent.getActivity(context, 0, resultIntent, PendingIntent.FLAG_UPDATE_CURRENT);

        Notification notification =
                new NotificationCompat.Builder(context, NotificationUtil.NOTIFICATION_CHANNEL_ID)
                        .setContentTitle(context.getString(R.string.stayaway_covid_service_notification_sync_error_title))
                        .setContentText(context.getString(R.string.stayaway_covid_service_notification_sync_error_text))
                        .setStyle(new NotificationCompat.BigTextStyle()
                                .bigText(context.getString(R.string.stayaway_covid_service_notification_sync_error_text)))
                        .setPriority(NotificationCompat.PRIORITY_MAX)
                        .setSmallIcon(R.drawable.ic_stayaway_logo)
                        .setContentIntent(pendingIntent)
                        .setAutoCancel(true)
                        .build();

        NotificationManager notificationManager =
                (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        notificationManager.notify(NotificationUtil.NOTIFICATION_ID_SYNC_ERROR, notification);
    }
}
