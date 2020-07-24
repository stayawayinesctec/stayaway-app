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
import android.os.Bundle;

import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen;
import org.dpppt.android.sdk.DP3T;

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
    super.onCreate(savedInstanceState);
  }

  @Override
  public void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    DP3T.onActivityResult(this, requestCode, resultCode, data);
    TracingManagerModule.onActivityResult(requestCode, resultCode, data);
  }
}
