package com.morodomino.android.data.model

import com.morodomino.android.data.local.QuickGameSessionEntity
import com.morodomino.android.data.local.QuickGameSideEntity
import com.morodomino.android.domain.QuickGameMode
import org.junit.Assert.assertEquals
import org.junit.Test

class QuickGameMapperTest {
    @Test
    fun mapsStoredEnumModeNamesAndRoundCount() {
        val session = baseSession(mode = QuickGameMode.FOUR_PLAYER_TWO_VS_TWO.name)
        val domain = session.toDomain(
            sides = listOf(
                side(index = 1, name = "Team 2", score = 40),
                side(index = 0, name = "Team 1", score = 70)
            ),
            roundCount = 3
        )

        assertEquals(QuickGameMode.FOUR_PLAYER_TWO_VS_TWO, domain.mode)
        assertEquals(3, domain.roundCount)
        assertEquals(listOf("Team 1", "Team 2"), domain.sides.map { it.displayName })
        assertEquals(listOf(70, 40), domain.sides.map { it.currentGameScore })
    }

    @Test
    fun stillMapsLegacyModeIds() {
        assertEquals(QuickGameMode.TWO_PLAYER, baseSession(mode = "2P").toDomain(emptyList()).mode)
        assertEquals(QuickGameMode.THREE_PLAYER, baseSession(mode = "3P").toDomain(emptyList()).mode)
        assertEquals(
            QuickGameMode.FOUR_PLAYER_TWO_VS_TWO,
            baseSession(mode = "4P").toDomain(emptyList()).mode
        )
    }

    private fun baseSession(mode: String): QuickGameSessionEntity = QuickGameSessionEntity(
        id = "session",
        createdAt = "2026-06-07T00:00:00Z",
        updatedAt = "2026-06-07T00:00:00Z",
        mode = mode,
        pointCap = 151,
        gamesPerSet = 3,
        setsPerNight = 1,
        status = "active",
        currentGameNumber = 1,
        currentSetNumber = 1
    )

    private fun side(index: Int, name: String, score: Int): QuickGameSideEntity = QuickGameSideEntity(
        id = "side-$index",
        sessionId = "session",
        sideIndex = index,
        displayName = name,
        playersPerTeam = 1,
        currentGameScore = score,
        gamesWon = 0,
        setsWon = 0
    )
}
