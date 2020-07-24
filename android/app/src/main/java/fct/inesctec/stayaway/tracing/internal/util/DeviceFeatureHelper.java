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

package fct.inesctec.stayaway.tracing.internal.util;

import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.PowerManager;
import android.provider.Settings;

import androidx.annotation.NonNull;

public class DeviceFeatureHelper {

	public static boolean isBluetoothEnabled() {
		BluetoothAdapter bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
		return bluetoothAdapter != null && bluetoothAdapter.isEnabled();
	}

	public static boolean isBatteryOptimizationDeactivated(Context context) {
		PowerManager powerManager = (PowerManager) context.getSystemService(Context.POWER_SERVICE);
		return powerManager.isIgnoringBatteryOptimizations(context.getPackageName());
	}

	public static void openApplicationSettings(@NonNull Activity activity) {
		Intent intent = new Intent();
		intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
		Uri uri = Uri.fromParts("package", activity.getPackageName(), null);
		intent.setData(uri);
		activity.startActivity(intent);
	}

	public static void openPlayServicesInPlayStore(@NonNull Context context) {
		final String playServicesPackageName = "com.google.android.gms";
		try {
			context.startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse("market://details?id=" + playServicesPackageName)));
		} catch (android.content.ActivityNotFoundException e) {
			context.startActivity(new Intent(Intent.ACTION_VIEW,
					Uri.parse("https://play.google.com/store/apps/details?id=" + playServicesPackageName)));
		}
	}

}
