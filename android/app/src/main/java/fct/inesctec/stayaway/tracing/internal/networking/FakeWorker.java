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
import androidx.work.Data;
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
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;

import fct.inesctec.stayaway.BuildConfig;
import fct.inesctec.stayaway.tracing.internal.networking.errors.ResponseError;
import fct.inesctec.stayaway.tracing.internal.networking.models.AuthenticationCodeRequestModel;
import fct.inesctec.stayaway.tracing.internal.networking.models.AuthenticationCodeResponseModel;
import fct.inesctec.stayaway.tracing.internal.storage.SecureStorage;
import fct.inesctec.stayaway.tracing.internal.util.ExponentialDistribution;

public class FakeWorker extends Worker {

	private static final String TAG = "FakeWorker";
	private static final String WORK_TAG = "fct.inesctec.stayaway.FakeWorker";
	private static final String FAKE_AUTH_CODE = "000000000000";

	private static final long FACTOR_HOUR_MILLIS = 60 * 60 * 1000L;
	private static final long FACTOR_DAY_MILLIS = 24 * FACTOR_HOUR_MILLIS;
	private static final long MAX_DELAY_HOURS = 48;
	private static final float SAMPLING_RATE = BuildConfig.IS_RELEASE.equals("TRUE") ? 0.2f : 1.0f;

	public static Clock clock = new ClockImpl();

	public FakeWorker(@NonNull Context context, @NonNull WorkerParameters workerParams) {
		super(context, workerParams);
	}

	public static void safeStartFakeWorker(Context context) {
		long t_dummy = SecureStorage.getInstance(context).getTDummy();
		if (t_dummy == -1) {
			t_dummy = clock.currentTimeMillis() + clock.syncInterval();
			SecureStorage.getInstance(context).setTDummy(t_dummy);
		}
		startFakeWorker(context, ExistingWorkPolicy.KEEP, t_dummy);
	}

	private static void startFakeWorker(Context context, ExistingWorkPolicy policy, long t_dummy) {
		long now = clock.currentTimeMillis();
		long executionDelay = Math.max(0L, t_dummy - now);
		double executionDelayDays = (double) executionDelay / FACTOR_DAY_MILLIS;

		Logger.d(TAG, "scheduled for execution in " + executionDelayDays + " days");

		Constraints constraints = new Constraints.Builder()
				.setRequiredNetworkType(NetworkType.CONNECTED)
				.build();

		OneTimeWorkRequest fakeWorker = new OneTimeWorkRequest.Builder(FakeWorker.class)
				.setConstraints(constraints)
				.setInitialDelay(executionDelay, TimeUnit.MILLISECONDS)
				.addTag(WORK_TAG)
				.build();

		WorkManager.getInstance(context).enqueueUniqueWork(WORK_TAG, policy, fakeWorker);
	}

	@NonNull
	@Override
	public ListenableWorker.Result doWork() {
		long now = clock.currentTimeMillis();
		SecureStorage secureStorage = SecureStorage.getInstance(getApplicationContext());
 		long t_dummy = secureStorage.getTDummy();
 		if (t_dummy < 0) {
 			//if t_dummy < 0 because of some weird state, we reset it
 			t_dummy = now + clock.syncInterval();
 		}
 		//to make sure we can still write the EncryptedSharedPreferences, we always write the value back
 		secureStorage.setTDummy(t_dummy);

		while (t_dummy < now) {
			Logger.d(TAG, "start");
			// only do request if it was planned to do in the last 48h
			if (t_dummy >= now - FACTOR_HOUR_MILLIS * MAX_DELAY_HOURS) {
				DP3T.addWorkerStartedToHistory(getApplicationContext(), "fake");
				boolean success = executeFakeRequest(getApplicationContext());
				if (success) {
					Logger.d(TAG, "finished with success");
				} else {
					Logger.e(TAG, "failed");
					return Result.retry();
				}
			} else {
				Logger.d(TAG, "outdated request is dropped.");
			}
			t_dummy += clock.syncInterval();
			secureStorage.setTDummy(t_dummy);
		}

		startFakeWorker(getApplicationContext(), ExistingWorkPolicy.APPEND, t_dummy);
		return Result.success();
	}

    private boolean executeFakeRequest(Context context) {
		try {
			AuthCodeRepository authCodeRepository = new AuthCodeRepository(context);
			AuthenticationCodeResponseModel accessTokenResponse =
					authCodeRepository.getAccessTokenSync(new AuthenticationCodeRequestModel(FAKE_AUTH_CODE, 1));
			String accessToken = accessTokenResponse.getAccessToken();

			CountDownLatch countdownLatch = new CountDownLatch(1);
			AtomicBoolean error = new AtomicBoolean(false);
			DP3T.sendFakeInfectedRequest(context, new ExposeeAuthMethodAuthorization(getAuthorizationHeader(accessToken)),
					() -> {
						countdownLatch.countDown();
					},
					() -> {
						error.set(true);
						countdownLatch.countDown();
					});
			countdownLatch.await();
			if (error.get()) return false;
			return true;
		} catch (IOException | ResponseError | InterruptedException e) {
			Logger.e(TAG, "fake request failed", e);
			return false;
		}
	}

	private String getAuthorizationHeader(String accessToken) {
		return "Bearer " + accessToken;
	}

	public interface Clock {
		long syncInterval();

		long currentTimeMillis();

	}


	public static class ClockImpl implements Clock {
		public long syncInterval() {
			double newDelayDays = ExponentialDistribution.sampleFromStandard() / SAMPLING_RATE;
			return (long) (newDelayDays * FACTOR_DAY_MILLIS);
		}

		public long currentTimeMillis() {
			return System.currentTimeMillis();
		}

	}
}
