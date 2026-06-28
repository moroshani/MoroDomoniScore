package com.morodomino.android.data.remote

import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.PATCH
import retrofit2.http.POST
import retrofit2.http.Path

interface AuthApi {
    @POST("/api/auth/register")
    suspend fun register(@Body request: RegisterRequest): AuthResponse

    @POST("/api/auth/login")
    suspend fun login(@Body request: LoginRequest): AuthResponse

    @POST("/api/auth/logout")
    suspend fun logout(): Unit

    @GET("/api/users/me")
    suspend fun getMe(): MeResponse

    @PATCH("/api/users/me")
    suspend fun updateMe(@Body request: UpdateProfileRequest): MeResponse

    @PATCH("/api/users/me/password")
    suspend fun changePassword(@Body request: ChangePasswordRequest): SimpleOkResponse

    @GET("/api/users/me/passkeys")
    suspend fun listPasskeys(): PasskeyListResponse

    @DELETE("/api/users/me/passkeys/{id}")
    suspend fun removePasskey(@Path("id") id: String): SimpleOkResponse
}

data class RegisterRequest(
    val name: String,
    val username: String,
    val email: String,
    val password: String,
    val rememberMe: Boolean = true
)

data class LoginRequest(
    val identifier: String,
    val password: String,
    val rememberMe: Boolean = true
)

data class UpdateProfileRequest(
    val name: String,
    val username: String,
    val email: String
)

data class ChangePasswordRequest(
    val currentPassword: String,
    val newPassword: String
)

data class AuthResponse(
    val user: UserDto,
    val token: String
)

data class MeResponse(
    val user: UserDto
)

data class SimpleOkResponse(
    val ok: Boolean
)

data class PasskeyListResponse(
    val passkeys: List<PasskeyCredentialDto>
)

data class PasskeyCredentialDto(
    val id: String,
    val createdAt: String? = null,
    val lastUsedAt: String? = null,
    val deviceType: String? = null,
    val backedUp: Boolean? = null
)

data class UserDto(
    val id: String,
    val name: String,
    val username: String,
    val email: String,
    val avatar: String? = null,
    val role: String? = null,
    val createdAt: String? = null,
    val isImmortal: Boolean? = null
)
