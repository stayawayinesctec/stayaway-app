/*
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

package fct.inesctec.stayaway;

import android.app.Activity;
import android.app.Application;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;

import fct.inesctec.stayaway.tracing.TracingManagerModule;

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;

import org.dpppt.android.sdk.DP3T;

import java.lang.reflect.InvocationTargetException;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

import fct.inesctec.stayaway.tracing.TracingManagerPackage;
import fct.inesctec.stayaway.tracing.internal.util.ActivityLifecycleCallbacksAdapter;

public class MainApplication extends Application implements ReactApplication {
  private static final long BACKGROUND_TIMEOUT_SESSION_MS = 30 * 60 * 1000L;

  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
            packages.add(new TracingManagerPackage());
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    TracingManagerModule.init(this);

    // Register Activity Lifecycle Callbacks
    registerActivityLifecycleCallbacks(new ActivityLifecycleCallbacksAdapter() {
      private long tsActivitiesStop = 0;
      private AtomicInteger numCreated = new AtomicInteger(0);
      private AtomicInteger numStarted = new AtomicInteger(0);

      @Override
      public void onActivityCreated(Activity activity, Bundle savedInstanceState) {
        numCreated.incrementAndGet();
      }

      @Override
      public void onActivityStarted(Activity activity) {
        if (numStarted.getAndIncrement() == 0) {
          if (tsActivitiesStop > 0 && System.currentTimeMillis() - tsActivitiesStop > BACKGROUND_TIMEOUT_SESSION_MS) {
            Intent mainActivityIntent = new Intent(getApplicationContext(), MainActivity.class);
            mainActivityIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
            startActivity(mainActivityIntent);
          }
          DP3T.addClientOpenedToHistory(MainApplication.this);
        }
      }

      @Override
      public void onActivityStopped(Activity activity) {
        if (numStarted.decrementAndGet() == 0) tsActivitiesStop = System.currentTimeMillis();
      }

      @Override
      public void onActivityDestroyed(Activity activity) {
        if (numCreated.decrementAndGet() == 0) tsActivitiesStop = 0;
      }
    });
  }

  @Override
  public void onTerminate() {
    TracingManagerModule.terminate(this);
    super.onTerminate();
  }
}
