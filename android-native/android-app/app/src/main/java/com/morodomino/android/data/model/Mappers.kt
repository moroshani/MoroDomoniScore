package com.morodomino.android.data.model

import com.morodomino.android.data.local.QuickGameSessionEntity
import com.morodomino.android.data.local.QuickGameSideEntity
import com.morodomino.android.data.remote.UserDto
import com.morodomino.android.domain.QuickGameMode
import com.morodomino.android.domain.QuickGameSession
import com.morodomino.android.domain.QuickGameSide
import com.morodomino.android.domain.User

fun UserDto.toDomain(): User = User(
    id = id,
    name = name,
    username = username,
    email = email,
    avatar = avatar,
    role = role,
    isImmortal = isImmortal == true
)

fun QuickGameSessionEntity.toDomain(
    sides: List<QuickGameSideEntity>,
    roundCount: Int = 0
): QuickGameSession = QuickGameSession(
    id = id,
    mode = mode.toMode(),
    pointCap = pointCap,
    gamesPerSet = gamesPerSet,
    setsPerNight = setsPerNight,
    status = status,
    currentGameNumber = currentGameNumber,
    currentSetNumber = currentSetNumber,
    roundCount = roundCount,
    createdAt = createdAt,
    updatedAt = updatedAt,
    sides = sides.sortedBy { it.sideIndex }.map { it.toDomain() }
)

fun QuickGameSideEntity.toDomain(): QuickGameSide = QuickGameSide(
    id = id,
    sideIndex = sideIndex,
    displayName = displayName,
    playersPerTeam = playersPerTeam,
    currentGameScore = currentGameScore,
    gamesWon = gamesWon,
    setsWon = setsWon
)

private fun String.toMode(): QuickGameMode = when (this) {
    QuickGameMode.TWO_PLAYER.name, "2P" -> QuickGameMode.TWO_PLAYER
    QuickGameMode.THREE_PLAYER.name, "3P" -> QuickGameMode.THREE_PLAYER
    QuickGameMode.FOUR_PLAYER_TWO_VS_TWO.name, "4P" -> QuickGameMode.FOUR_PLAYER_TWO_VS_TWO
    else -> QuickGameMode.TWO_PLAYER
}
