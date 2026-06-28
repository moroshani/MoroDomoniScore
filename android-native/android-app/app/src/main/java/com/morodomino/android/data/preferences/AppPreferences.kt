package com.morodomino.android.data.preferences

import android.content.Context
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

private val Context.dataStore by preferencesDataStore(name = "morodomino_preferences")

class AppPreferences(private val context: Context) {
    private val keyTheme = stringPreferencesKey("theme")
    private val keySoundEnabled = booleanPreferencesKey("sound_enabled")
    private val keyHapticsEnabled = booleanPreferencesKey("haptics_enabled")
    private val keyNotificationsEnabled = booleanPreferencesKey("notifications_enabled")

    val theme: Flow<String> = context.dataStore.data.map { prefs ->
        prefs[keyTheme] ?: "system"
    }

    val soundEnabled: Flow<Boolean> = context.dataStore.data.map { prefs ->
        prefs[keySoundEnabled] ?: true
    }

    val hapticsEnabled: Flow<Boolean> = context.dataStore.data.map { prefs ->
        prefs[keyHapticsEnabled] ?: true
    }

    val notificationsEnabled: Flow<Boolean> = context.dataStore.data.map { prefs ->
        prefs[keyNotificationsEnabled] ?: false
    }

    suspend fun setTheme(value: String) {
        context.dataStore.edit { prefs -> prefs[keyTheme] = value }
    }

    suspend fun setSoundEnabled(value: Boolean) {
        context.dataStore.edit { prefs -> prefs[keySoundEnabled] = value }
    }

    suspend fun setHapticsEnabled(value: Boolean) {
        context.dataStore.edit { prefs -> prefs[keyHapticsEnabled] = value }
    }

    suspend fun setNotificationsEnabled(value: Boolean) {
        context.dataStore.edit { prefs -> prefs[keyNotificationsEnabled] = value }
    }
}
