package com.morodomino.android.domain

enum class QuickGameMode {
    TWO_PLAYER,
    THREE_PLAYER,
    FOUR_PLAYER_TWO_VS_TWO
}

data class User(
    val id: String,
    val name: String,
    val username: String,
    val email: String,
    val avatar: String?,
    val role: String?,
    val isImmortal: Boolean
)

data class AuthSession(
    val token: String,
    val user: User
)

data class ProfileUpdate(
    val name: String,
    val username: String,
    val email: String
)

data class PasswordChange(
    val currentPassword: String,
    val newPassword: String
)

data class PasskeyCredential(
    val id: String,
    val createdAt: String?,
    val lastUsedAt: String?,
    val deviceType: String?,
    val backedUp: Boolean?
)

data class QuickGameSide(
    val id: String,
    val sideIndex: Int,
    val displayName: String,
    val playersPerTeam: Int,
    val currentGameScore: Int,
    val gamesWon: Int,
    val setsWon: Int
)

data class QuickGameSession(
    val id: String,
    val mode: QuickGameMode,
    val pointCap: Int,
    val gamesPerSet: Int,
    val setsPerNight: Int,
    val status: String,
    val currentGameNumber: Int,
    val currentSetNumber: Int,
    val roundCount: Int = 0,
    val createdAt: String,
    val updatedAt: String,
    val sides: List<QuickGameSide>
)
