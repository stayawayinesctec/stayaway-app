# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# Package: react-native-config
-keep class fct.inesctec.stayaway.BuildConfig { *; }

# Package: react-native-svg
-keep public class com.horcrux.svg.** {*;}

-dontobfuscate

# Retrofit models
-keep class fct.inesctec.stayaway.tracing.internal.models.** { *; }
-keep class fct.inesctec.stayaway.tracing.internal.networking.models.** { *; }
