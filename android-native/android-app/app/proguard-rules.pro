# Keep default for initial scaffold.

# Room database
-keep @androidx.room.RoomDatabase
-keep @androidx.room.Entity
-keep @androidx.room.Dao
-keep @androidx.room.Query
-keep class androidx.room.RoomMasterTable
-keep class androidx.room.RoomOpenTable

# Retrofit & Moshi
-keep class retrofit2.** { *; }
-keep class okhttp3.** { *; }
-keep class com.squareup.moshi.** { *; }
-keep class com.morodomino.android.data.remote.** { *; }
-keep class com.morodomino.android.data.model.** { *; }

# Kotlin coroutines
-keep class kotlinx.coroutines.** { *; }

# Security-crypto
-keep class androidx.security.crypto.** { *; }

# Keep model classes with @JvmField
-keep public class com.morodomino.android.domain.Models
-keep public class com.morodomino.android.domain.QuickGameScoring

# Keep all classes in the package
-keep class com.morodomino.android.** { *; }
