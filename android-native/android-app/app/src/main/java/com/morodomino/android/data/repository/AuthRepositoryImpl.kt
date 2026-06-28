package com.morodomino.android.data.repository

import com.morodomino.android.data.model.toDomain
import com.morodomino.android.data.remote.ApiClient
import com.morodomino.android.data.remote.ChangePasswordRequest
import com.morodomino.android.data.remote.LoginRequest
import com.morodomino.android.data.remote.RegisterRequest
import com.morodomino.android.data.remote.UpdateProfileRequest
import com.morodomino.android.data.security.TokenStore
import com.morodomino.android.domain.AppError
import com.morodomino.android.domain.AuthSession
import com.morodomino.android.domain.PasswordChange
import com.morodomino.android.domain.PasskeyCredential
import com.morodomino.android.domain.ProfileUpdate
import com.morodomino.android.domain.User
import retrofit2.HttpException
import java.io.IOException

class AuthRepositoryImpl(
    private val tokenStore: TokenStore
) : AuthRepository {
    override suspend fun bootstrapSession(): AuthSession? {
        val token = tokenStore.readToken() ?: return null
        ApiClient.setAuthToken(token)
        return try {
            val me = ApiClient.authApi.getMe().user.toDomain()
            AuthSession(token = token, user = me)
        } catch (_: Exception) {
            tokenStore.clearToken()
            ApiClient.setAuthToken(null)
            null
        }
    }

    override suspend fun register(
        name: String,
        username: String,
        email: String,
        password: String
    ): AuthSession = execute {
        val response = ApiClient.authApi.register(
            RegisterRequest(
                name = name,
                username = username,
                email = email,
                password = password,
                rememberMe = true
            )
        )
        persistSession(response.token, response.user.toDomain())
    }

    override suspend fun login(identifier: String, password: String): AuthSession = execute {
        val response = ApiClient.authApi.login(
            LoginRequest(
                identifier = identifier,
                password = password,
                rememberMe = true
            )
        )
        persistSession(response.token, response.user.toDomain())
    }

    override suspend fun logout() {
        execute { ApiClient.authApi.logout() }
        tokenStore.clearToken()
        ApiClient.setAuthToken(null)
    }

    override suspend fun getMe(): User = execute {
        ApiClient.authApi.getMe().user.toDomain()
    }

    override suspend fun updateProfile(update: ProfileUpdate): User = execute {
        ApiClient.authApi.updateMe(
            UpdateProfileRequest(
                name = update.name,
                username = update.username,
                email = update.email
            )
        ).user.toDomain()
    }

    override suspend fun changePassword(change: PasswordChange) {
        execute {
            ApiClient.authApi.changePassword(
                ChangePasswordRequest(
                    currentPassword = change.currentPassword,
                    newPassword = change.newPassword
                )
            )
        }
    }

    override suspend fun listPasskeys(): List<PasskeyCredential> = execute {
        ApiClient.authApi.listPasskeys().passkeys.map { item ->
            PasskeyCredential(
                id = item.id,
                createdAt = item.createdAt,
                lastUsedAt = item.lastUsedAt,
                deviceType = item.deviceType,
                backedUp = item.backedUp
            )
        }
    }

    override suspend fun removePasskey(passkeyId: String) {
        execute {
            ApiClient.authApi.removePasskey(passkeyId)
        }
    }

    private fun persistSession(token: String, user: User): AuthSession {
        tokenStore.saveToken(token)
        ApiClient.setAuthToken(token)
        return AuthSession(token = token, user = user)
    }

    private suspend fun <T> execute(block: suspend () -> T): T {
        try {
            return block()
        } catch (error: IOException) {
            throw AppError.Network(error.message ?: "NETWORK_ERROR")
        } catch (error: HttpException) {
            throw when (error.code()) {
                400 -> AppError.Validation()
                401, 403 -> AppError.Unauthorized()
                409 -> AppError.Conflict()
                else -> AppError.Unknown("HTTP_${error.code()}")
            }
        } catch (error: AppError) {
            throw error
        } catch (error: Exception) {
            throw AppError.Unknown(error.message ?: "UNKNOWN")
        }
    }
}
