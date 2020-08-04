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

import androidx.annotation.NonNull;

import org.dpppt.android.sdk.DP3T;
import org.dpppt.android.sdk.backend.ResponseCallback;
import org.dpppt.android.sdk.backend.UserAgentInterceptor;

import java.io.IOException;

import fct.inesctec.stayaway.BuildConfig;
import fct.inesctec.stayaway.tracing.internal.networking.errors.InvalidCodeError;
import fct.inesctec.stayaway.tracing.internal.networking.errors.ResponseError;
import fct.inesctec.stayaway.tracing.internal.networking.models.AuthenticationCodeRequestModel;
import fct.inesctec.stayaway.tracing.internal.networking.models.AuthenticationCodeResponseModel;
import okhttp3.Cache;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class AuthCodeRepository {

    private AuthCodeService authCodeService;

    public AuthCodeRepository(@NonNull Context context) {

        OkHttpClient.Builder okHttpBuilder = new OkHttpClient.Builder();
        okHttpBuilder.addInterceptor(chain -> {
            Request request = chain.request()
                    .newBuilder()
                    .build();
            return chain.proceed(request);
        });

        int cacheSize = 5 * 1024 * 1024; // 5 MB
        Cache cache = new Cache(context.getCacheDir(), cacheSize);
        okHttpBuilder.cache(cache);

        okHttpBuilder.certificatePinner(CertificatePinning.getCertificatePinner());
        okHttpBuilder.addInterceptor(new UserAgentInterceptor(DP3T.getUserAgent()));

        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(BuildConfig.AUTH_CODE_URL)
                .client(okHttpBuilder.build())
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        authCodeService = retrofit.create(AuthCodeService.class);
    }

    public void getAccessToken(@NonNull AuthenticationCodeRequestModel authenticationCode,
                               @NonNull ResponseCallback<AuthenticationCodeResponseModel> callbackListener) {

        authCodeService.getAccessToken(authenticationCode).enqueue(new Callback<AuthenticationCodeResponseModel>() {
            @Override
            public void onResponse(Call<AuthenticationCodeResponseModel> call,
                                   Response<AuthenticationCodeResponseModel> response) {
                if (response.isSuccessful()) {
                    callbackListener.onSuccess(response.body());
                } else {
                    if (response.code() == 404) {
                        onFailure(call, new InvalidCodeError());
                    } else {
                        onFailure(call, new ResponseError(response.raw()));
                    }
                }
            }

            @Override
            public void onFailure(Call<AuthenticationCodeResponseModel> call, Throwable t) {
                callbackListener.onError(t);
            }
        });
    }

    public AuthenticationCodeResponseModel getAccessTokenSync(@NonNull AuthenticationCodeRequestModel authenticationCode)
            throws IOException, ResponseError {
        Response<AuthenticationCodeResponseModel> response = authCodeService.getAccessToken(authenticationCode).execute();
        if (!response.isSuccessful()) throw new ResponseError(response.raw());
        return response.body();
    }

}
