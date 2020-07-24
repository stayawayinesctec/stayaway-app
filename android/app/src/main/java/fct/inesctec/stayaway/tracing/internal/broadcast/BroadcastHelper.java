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

import android.content.Context;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.dpppt.android.sdk.DP3T;
import org.dpppt.android.sdk.TracingStatus;

import fct.inesctec.stayaway.tracing.TracingManagerModule;
import fct.inesctec.stayaway.tracing.internal.util.WritableMapHelper;

public class BroadcastHelper {
    public static void sendUpdateBroadcast(Context context) {
        TracingStatus status = DP3T.getStatus(context);

        sendEvent(TracingManagerModule.getReactContext(),
                TracingManagerModule.UPDATE_EVENT,
                WritableMapHelper.wrapTracingStatus(status));
    }
    /**
     * Send events to Javascript
     * @param reactContext
     * @param eventName
     * @param params
     */
    private static void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable Object params) {

        if (reactContext != null) {
            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(eventName, params);
        }
    }
}
