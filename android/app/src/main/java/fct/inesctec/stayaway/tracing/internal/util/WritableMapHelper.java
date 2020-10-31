/*
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

package fct.inesctec.stayaway.tracing.internal.util;

import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;

import org.dpppt.android.sdk.TracingStatus;
import org.dpppt.android.sdk.models.ExposureDay;

public class WritableMapHelper {
    /**
     * Convert TracingStatus to WritableMap.
     *
     * @param status
     *
     * @return WritableMap
     */
    public static WritableMap wrapTracingStatus(TracingStatus status) {
        WritableMap writableMap = new WritableNativeMap();

        writableMap.putDouble("lastSyncDate", status.getLastSyncDate());
        writableMap.putInt("infectionStatus", status.getInfectionStatus().ordinal());

        // Format exposure days
        WritableArray exposureDays = new WritableNativeArray();

        for(ExposureDay exposureDay: status.getExposureDays() ) {
            WritableMap exposureDayMap = new WritableNativeMap();

            exposureDayMap.putInt("id", exposureDay.getId());
            exposureDayMap.putDouble("exposedDate", exposureDay.getExposedDate().getStartOfDayTimestamp());
            exposureDayMap.putDouble("reportDate", exposureDay.getReportDate());

            exposureDays.pushMap(exposureDayMap);
        }

        writableMap.putArray("exposureDays", exposureDays);

        // Format errors
        WritableArray errors = new WritableNativeArray();

        for(org.dpppt.android.sdk.TracingStatus.ErrorState error: status.getErrors() ) {
            errors.pushInt(error.ordinal());
        }

        writableMap.putArray("errors", errors);

        return writableMap;
    }

    /**
     * Convert device info to WritableMap.
     *
     * @param info
     *
     * @return WritableMap
     */
    public static WritableMap wrapDeviceInfo(DeviceInfo info) {
        WritableMap writableMap = new WritableNativeMap();

        writableMap.putString("OSVersion", info.getOSVersion());
        writableMap.putString("deviceModel", info.getDeviceModel());
        writableMap.putString("versionName", info.getVersionName());
        writableMap.putString("versionCode", info.getVersionCode());

        return writableMap;
    }
}
