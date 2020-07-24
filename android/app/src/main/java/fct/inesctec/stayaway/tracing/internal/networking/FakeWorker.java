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
import androidx.work.Constraints;
import androidx.work.ExistingWorkPolicy;
import androidx.work.ListenableWorker;
import androidx.work.NetworkType;
import androidx.work.OneTimeWorkRequest;
import androidx.work.WorkManager;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

import org.dpppt.android.sdk.DP3T;
import org.dpppt.android.sdk.internal.logger.Logger;
import org.dpppt.android.sdk.models.ExposeeAuthMethodAuthorization;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

import fct.inesctec.stayaway.BuildConfig;
import fct.inesctec.stayaway.tracing.internal.networking.errors.ResponseError;
import fct.inesctec.stayaway.tracing.internal.networking.models.AuthenticationCodeRequestModel;
import fct.inesctec.stayaway.tracing.internal.networking.models.AuthenticationCodeResponseModel;
import fct.inesctec.stayaway.tracing.internal.util.ExponentialDistribution;

public class FakeWorker extends Worker {

    private static final String TAG = "FakeWorker";
    private static final String WORK_TAG = "fct.inesctec.stayaway.FakeWorker";
    private static final String FAKE_AUTH_CODE = "000000000000";

    private static final float SAMPLING_RATE = BuildConfig.IS_RELEASE.equals("FALSE") ? 0.2f : 1.0f;
    private static final long FACTOR_DAY_MILLIS = 24 * 60 * 60 * 1000L;

    public static void safeStartFakeWorker(Context context) {
        startFakeWorker(context, ExistingWorkPolicy.KEEP);
    }

    private static void startFakeWorker(Context context, ExistingWorkPolicy policy) {
        double newDelayDays = ExponentialDistribution.sampleFromStandard() / SAMPLING_RATE;
        long newDelayMillis = Math.round(FACTOR_DAY_MILLIS * newDelayDays);

        Logger.d(TAG, "scheduled for execution in " + newDelayDays + " days");

        Constraints constraints = new Constraints.Builder()
                .setRequiredNetworkType(NetworkType.CONNECTED)
                .build();

        OneTimeWorkRequest fakeWorker = new OneTimeWorkRequest.Builder(FakeWorker.class)
                .setConstraints(constraints)
                .setInitialDelay(newDelayMillis, TimeUnit.MILLISECONDS)
                .build();
        WorkManager.getInstance(context).enqueueUniqueWork(WORK_TAG, policy, fakeWorker);
    }

    public FakeWorker(@NonNull Context context, @NonNull WorkerParameters workerParams) {
        super(context, workerParams);
    }

    @NonNull
    @Override
    public ListenableWorker.Result doWork() {
        Logger.d(TAG, "start");
        DP3T.addWorkerStartedToHistory(getApplicationContext(), "fake");
        try {
            executeFakeRequest(getApplicationContext());
            startFakeWorker(getApplicationContext(), ExistingWorkPolicy.APPEND);
        } catch (IOException | ResponseError e) {
            Logger.e(TAG, "failed", e);
            return Result.retry();
        }
        Logger.d(TAG, "finished with success");
        return Result.success();
    }

    private void executeFakeRequest(Context context)
            throws IOException, ResponseError {
        AuthCodeRepository authCodeRepository = new AuthCodeRepository(context);
        AuthenticationCodeResponseModel accessTokenResponse =
                authCodeRepository.getAccessTokenSync(new AuthenticationCodeRequestModel(FAKE_AUTH_CODE, 1));
        String accessToken = accessTokenResponse.getAccessToken();

        DP3T.sendFakeInfectedRequest(context, new ExposeeAuthMethodAuthorization(getAuthorizationHeader(accessToken)));
    }

    private String getAuthorizationHeader(String accessToken) {
        return "Bearer " + accessToken;
    }

}
