package com.morodomino.android.security

import android.content.Context
import androidx.credentials.CredentialManager

class PasskeyManager(context: Context) {
    private val credentialManager: CredentialManager = CredentialManager.create(context)

    fun isAvailable(): Boolean {
        return try {
            credentialManager
            true
        } catch (_: Throwable) {
            false
        }
    }
}
