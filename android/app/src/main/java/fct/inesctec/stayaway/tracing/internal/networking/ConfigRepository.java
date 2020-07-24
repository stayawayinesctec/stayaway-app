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
import android.os.Build;

import androidx.annotation.NonNull;

import org.dpppt.android.sdk.DP3T;
import org.dpppt.android.sdk.backend.UserAgentInterceptor;

import java.io.IOException;

import fct.inesctec.stayaway.BuildConfig;
import fct.inesctec.stayaway.tracing.internal.networking.errors.ResponseError;
import fct.inesctec.stayaway.tracing.internal.networking.models.ConfigResponseModel;
import fct.inesctec.stayaway.tracing.internal.storage.SecureStorage;
import okhttp3.Cache;
import okhttp3.OkHttpClient;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class ConfigRepository {
    private ConfigService configService;
    private SecureStorage secureStorage;

    public ConfigRepository(@NonNull Context context) {
        OkHttpClient.Builder okHttpBuilder = new OkHttpClient.Builder();

        int cacheSize = 2 * 1024 * 1024; // 2 MB
        Cache cache = new Cache(context.getCacheDir(), cacheSize);
        okHttpBuilder.cache(cache);

        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(BuildConfig.BACKEND_CONFIG_URL)
                .client(okHttpBuilder.build())
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        configService = retrofit.create(ConfigService.class);
        secureStorage = SecureStorage.getInstance(context);
    }

    public ConfigResponseModel getConfig() throws IOException, ResponseError {
        Response<ConfigResponseModel> configResponse = configService.getConfig().execute();
        if (configResponse.isSuccessful()) {
            secureStorage.setLastConfigLoadSuccess(System.currentTimeMillis());
            return configResponse.body();
        } else {
            throw new ResponseError(configResponse.raw());
        }
    }

}
