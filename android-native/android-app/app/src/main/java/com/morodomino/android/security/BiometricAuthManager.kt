package com.morodomino.android.security

import android.content.Context
import androidx.biometric.BiometricManager

class BiometricAuthManager(private val context: Context) {
    fun isBiometricAvailable(): Boolean {
        val manager = BiometricManager.from(context)
        val result = manager.canAuthenticate(BiometricManager.Authenticators.BIOMETRIC_STRONG or BiometricManager.Authenticators.BIOMETRIC_WEAK)
        return result == BiometricManager.BIOMETRIC_SUCCESS
    }
}
