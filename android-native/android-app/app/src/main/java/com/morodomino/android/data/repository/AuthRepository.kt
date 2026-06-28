package com.morodomino.android.data.repository

import com.morodomino.android.domain.AuthSession
import com.morodomino.android.domain.PasswordChange
import com.morodomino.android.domain.PasskeyCredential
import com.morodomino.android.domain.ProfileUpdate
import com.morodomino.android.domain.User

interface AuthRepository {
    suspend fun bootstrapSession(): AuthSession?
    suspend fun register(name: String, username: String, email: String, password: String): AuthSession
    suspend fun login(identifier: String, password: String): AuthSession
    suspend fun logout()
    suspend fun getMe(): User
    suspend fun updateProfile(update: ProfileUpdate): User
    suspend fun changePassword(change: PasswordChange)
    suspend fun listPasskeys(): List<PasskeyCredential>
    suspend fun removePasskey(passkeyId: String)
}
