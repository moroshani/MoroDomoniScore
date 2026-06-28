package com.morodomino.android.data.repository

import com.morodomino.android.data.local.QuickGameDao
import com.morodomino.android.data.local.QuickGameRoundEntity
import com.morodomino.android.data.local.QuickGameSessionEntity
import com.morodomino.android.data.local.QuickGameSideEntity
import com.morodomino.android.data.model.toDomain
import com.morodomino.android.domain.QuickGameMode
import com.morodomino.android.domain.QuickGameSession
import java.time.Instant
import java.util.UUID

class QuickGameRepositoryImpl(
    private val quickGameDao: QuickGameDao
) : QuickGameRepository {
    override suspend fun getActiveSession(): QuickGameSession? {
        val session = quickGameDao.getLatestActiveSession() ?: return null
        val sides = quickGameDao.getSidesBySession(session.id)
        val roundCount = quickGameDao.countRoundsBySession(session.id)
        return session.toDomain(sides, roundCount)
    }

    override suspend fun startSession(
        mode: QuickGameMode,
        sideNames: List<String>,
        pointCap: Int
    ): QuickGameSession {
        val now = Instant.now().toString()
        val sessionId = UUID.randomUUID().toString()
        val playersPerTeam = if (mode == QuickGameMode.FOUR_PLAYER_TWO_VS_TWO) 2 else 1
        val session = QuickGameSessionEntity(
            id = sessionId,
            createdAt = now,
            updatedAt = now,
            mode = mode.name,
            pointCap = pointCap,
            gamesPerSet = 3,
            setsPerNight = 1,
            status = "active",
            currentGameNumber = 1,
            currentSetNumber = 1
        )
        val sides = sideNames.mapIndexed { index, name ->
            QuickGameSideEntity(
                id = "$sessionId-side-$index",
                sessionId = sessionId,
                sideIndex = index,
                displayName = name,
                playersPerTeam = playersPerTeam,
                currentGameScore = 0,
                gamesWon = 0,
                setsWon = 0
            )
        }
        quickGameDao.createActiveSession(session, sides)
        return session.toDomain(sides)
    }

    override suspend fun addRound(
        sessionId: String,
        pointsBySide: List<Int>,
        nextScores: List<Int>,
        roundNumber: Int
    ) {
        val now = Instant.now().toString()
        val payload = pointsBySide.joinToString(prefix = "[", postfix = "]")
        quickGameDao.appendRoundAndScores(
            round = QuickGameRoundEntity(
                id = "$sessionId-round-$roundNumber",
                sessionId = sessionId,
                roundNumber = roundNumber,
                createdAt = now,
                payloadJson = payload
            ),
            scoresBySide = nextScores
        )
    }

    override suspend fun resetSession(sessionId: String) {
        quickGameDao.updateSessionStatus(
            sessionId = sessionId,
            status = "completed",
            updatedAt = Instant.now().toString()
        )
    }
}
