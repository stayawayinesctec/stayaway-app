#
# Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
#
# This Source Code Form is subject to the terms of the European Union
# Public License, v. 1.2. If a copy of the EUPL was not distributed with
# this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
#
# SPDX-License-Identifier: EUPL-1.2
#

# Package: react-native-config
-keep class fct.inesctec.stayaway.BuildConfig { *; }

# Package: react-native-svg
-keep public class com.horcrux.svg.** { *; }

-dontobfuscate

# Retrofit models
-keep class fct.inesctec.stayaway.tracing.internal.models.** { *; }
-keep class fct.inesctec.stayaway.tracing.internal.networking.models.** { *; }
