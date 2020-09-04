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

import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;

import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen;
import org.dpppt.android.sdk.DP3T;

import fct.inesctec.stayaway.BuildConfig;
import fct.inesctec.stayaway.tracing.TracingManagerModule;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "Divoc";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    SplashScreen.show(this);

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      getWindow().getDecorView().setSystemUiVisibility(
              View.SYSTEM_UI_FLAG_LAYOUT_STABLE |
              View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION |
              View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR
      );
    }

    if (BuildConfig.IS_RELEASE.equals("TRUE")) {
      getWindow().setFlags(
              WindowManager.LayoutParams.FLAG_SECURE,
              WindowManager.LayoutParams.FLAG_SECURE);
    }

    super.onCreate(savedInstanceState);
  }

  @Override
  public void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    DP3T.onActivityResult(this, requestCode, resultCode, data);
    TracingManagerModule.onActivityResult(requestCode, resultCode, data);
  }
}
