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

package fct.inesctec.stayaway.tracing.internal.storage;

import android.content.Context;
import android.content.SharedPreferences;
import androidx.annotation.NonNull;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.security.crypto.EncryptedSharedPreferences;
import androidx.security.crypto.MasterKeys;

import java.io.IOException;
import java.security.GeneralSecurityException;

public class SecureStorage {

    private static final String PREFERENCES = "SecureStorage";

    private static final String KEY_INFORM_TIME_REQ = "inform_time_req";
    private static final String KEY_INFORM_CODE_REQ = "inform_code_req";
    private static final String KEY_INFORM_TOKEN_REQ = "inform_token_req";
    private static final String KEY_LAST_SHOWN_CONTACT_ID = "last_shown_contact_id";
    private static final String KEY_LAST_CONFIG_LOAD_SUCCESS = "last_config_load_success";

    private static SecureStorage instance;

    private SharedPreferences prefs;

    private SecureStorage(@NonNull Context context) {
        try {
            String masterKeys = MasterKeys.getOrCreate(MasterKeys.AES256_GCM_SPEC);
            this.prefs = EncryptedSharedPreferences
                    .create(PREFERENCES, masterKeys, context, EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
                            EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM);
        } catch (GeneralSecurityException | IOException e) {
            this.prefs = null;
            e.printStackTrace();
        }
    }

    public static SecureStorage getInstance(Context context) {
        if (instance == null) {
            instance = new SecureStorage(context);
        }
        return instance;
    }

    public void saveInformTimeAndCodeAndToken(String informCode, String informToken) {
        prefs.edit().putLong(KEY_INFORM_TIME_REQ, System.currentTimeMillis())
                .putString(KEY_INFORM_CODE_REQ, informCode)
                .putString(KEY_INFORM_TOKEN_REQ, informToken)
                .apply();
    }

    public void clearInformTimeAndCodeAndToken() {
        prefs.edit().remove(KEY_INFORM_TIME_REQ)
                .remove(KEY_INFORM_CODE_REQ)
                .remove(KEY_INFORM_TOKEN_REQ)
                .apply();
    }

    public long getLastInformRequestTime() {
        return prefs.getLong(KEY_INFORM_TIME_REQ, 0);
    }

    public String getLastInformToken() {
        return prefs.getString(KEY_INFORM_TOKEN_REQ, null);
    }


    public int getLastShownContactId() {
        return prefs.getInt(KEY_LAST_SHOWN_CONTACT_ID, -1);
    }

    public void setLastShownContactId(int contactId) {
        prefs.edit().putInt(KEY_LAST_SHOWN_CONTACT_ID, contactId).apply();
    }

    public long getLastConfigLoadSuccess() {
        return prefs.getLong(KEY_LAST_CONFIG_LOAD_SUCCESS, 0);
    }

    public void setLastConfigLoadSuccess(long time) {
        prefs.edit().putLong(KEY_LAST_CONFIG_LOAD_SUCCESS, time).apply();
    }
}
