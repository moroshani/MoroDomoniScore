package com.morodomino.android.data.local

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Transaction

@Dao
interface QuickGameDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsertSession(session: QuickGameSessionEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsertSides(sides: List<QuickGameSideEntity>)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsertRound(round: QuickGameRoundEntity)

    @Query("SELECT * FROM quick_game_session WHERE status = 'active' ORDER BY updated_at DESC LIMIT 1")
    suspend fun getLatestActiveSession(): QuickGameSessionEntity?

    @Query("SELECT * FROM quick_game_side WHERE session_id = :sessionId ORDER BY side_index ASC")
    suspend fun getSidesBySession(sessionId: String): List<QuickGameSideEntity>

    @Query("SELECT * FROM quick_game_round WHERE session_id = :sessionId ORDER BY round_number ASC")
    suspend fun getRoundsBySession(sessionId: String): List<QuickGameRoundEntity>

    @Query("SELECT COUNT(*) FROM quick_game_round WHERE session_id = :sessionId")
    suspend fun countRoundsBySession(sessionId: String): Int

    @Query("UPDATE quick_game_session SET status = :status, updated_at = :updatedAt WHERE id = :sessionId")
    suspend fun updateSessionStatus(sessionId: String, status: String, updatedAt: String)

    @Query("UPDATE quick_game_session SET status = :status, updated_at = :updatedAt WHERE status = 'active'")
    suspend fun updateActiveSessionsStatus(status: String, updatedAt: String)

    @Query("UPDATE quick_game_side SET current_game_score = :score WHERE session_id = :sessionId AND side_index = :sideIndex")
    suspend fun updateSideScore(sessionId: String, sideIndex: Int, score: Int)

    @Transaction
    suspend fun createActiveSession(session: QuickGameSessionEntity, sides: List<QuickGameSideEntity>) {
        updateActiveSessionsStatus("completed", session.updatedAt)
        upsertSession(session)
        upsertSides(sides)
    }

    @Transaction
    suspend fun appendRoundAndScores(
        round: QuickGameRoundEntity,
        scoresBySide: List<Int>
    ) {
        upsertRound(round)
        scoresBySide.forEachIndexed { index, score ->
            updateSideScore(round.sessionId, index, score)
        }
    }
}
