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

import android.content.Context;
import android.content.SharedPreferences;

import okhttp3.CertificatePinner;

public class CertificatePinning {

	private static final CertificatePinner CERTIFICATE_PINNER_LIVE = new CertificatePinner.Builder()
			.add("stayaway.incm.pt", "sha256/KArAwbAlrVTa8DektoICjekhEwhJWKU39zEeo3SxzWA=")
			.add("stayaway.min-saude.pt", "sha256/N36p2K8/nu2qtj9uNAIxjVv/GNlVgXggPVjdhLXbZQg=")
			.add("stayaway.min-saude.pt", "sha256/Ud3zjF0T6gbOC5mwvzJSBPDLgAgu9OJ8ZbM9gkeZxxQ=")
			.build();

	private static final CertificatePinner CERTIFICATE_PINNER_DISABLED = new CertificatePinner.Builder().build();

	private static final String PREF_NAME_DEBUG = "debug";
	private static final String PREF_KEY_CERT_PINNING_ENABLED = "certificate_pinning_enabled";

	private static boolean isEnabled = true;

	public static CertificatePinner getCertificatePinner() {
		return isEnabled ? CERTIFICATE_PINNER_LIVE : CERTIFICATE_PINNER_DISABLED;
	}

	public static boolean isEnabled() {
		return isEnabled;
	}

	public static void setEnabled(boolean enabled, Context context) {
		isEnabled = enabled;
		getDebugPrefs(context).edit().putBoolean(PREF_KEY_CERT_PINNING_ENABLED, enabled).apply();
	}

	public static void initDebug(Context context) {
		isEnabled = getDebugPrefs(context).getBoolean(PREF_KEY_CERT_PINNING_ENABLED, isEnabled);
	}

	private static SharedPreferences getDebugPrefs(Context context) {
		return context.getSharedPreferences(PREF_NAME_DEBUG, Context.MODE_PRIVATE);
	}


}
