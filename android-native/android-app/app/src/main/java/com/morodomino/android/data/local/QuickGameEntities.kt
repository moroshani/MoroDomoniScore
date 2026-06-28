package com.morodomino.android.data.local

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.Index
import androidx.room.PrimaryKey

@Entity(tableName = "quick_game_session")
data class QuickGameSessionEntity(
    @PrimaryKey
    val id: String,
    @ColumnInfo(name = "created_at")
    val createdAt: String,
    @ColumnInfo(name = "updated_at")
    val updatedAt: String,
    val mode: String,
    @ColumnInfo(name = "point_cap")
    val pointCap: Int,
    @ColumnInfo(name = "games_per_set")
    val gamesPerSet: Int,
    @ColumnInfo(name = "sets_per_night")
    val setsPerNight: Int,
    val status: String,
    @ColumnInfo(name = "current_game_number")
    val currentGameNumber: Int,
    @ColumnInfo(name = "current_set_number")
    val currentSetNumber: Int
)

@Entity(
    tableName = "quick_game_side",
    foreignKeys = [
        ForeignKey(
            entity = QuickGameSessionEntity::class,
            parentColumns = ["id"],
            childColumns = ["session_id"],
            onDelete = ForeignKey.CASCADE
        )
    ],
    indices = [Index(value = ["session_id"])]
)
data class QuickGameSideEntity(
    @PrimaryKey
    val id: String,
    @ColumnInfo(name = "session_id")
    val sessionId: String,
    @ColumnInfo(name = "side_index")
    val sideIndex: Int,
    @ColumnInfo(name = "display_name")
    val displayName: String,
    @ColumnInfo(name = "players_per_team")
    val playersPerTeam: Int,
    @ColumnInfo(name = "current_game_score")
    val currentGameScore: Int,
    @ColumnInfo(name = "games_won")
    val gamesWon: Int,
    @ColumnInfo(name = "sets_won")
    val setsWon: Int
)

@Entity(
    tableName = "quick_game_round",
    foreignKeys = [
        ForeignKey(
            entity = QuickGameSessionEntity::class,
            parentColumns = ["id"],
            childColumns = ["session_id"],
            onDelete = ForeignKey.CASCADE
        )
    ],
    indices = [Index(value = ["session_id"])]
)
data class QuickGameRoundEntity(
    @PrimaryKey
    val id: String,
    @ColumnInfo(name = "session_id")
    val sessionId: String,
    @ColumnInfo(name = "round_number")
    val roundNumber: Int,
    @ColumnInfo(name = "created_at")
    val createdAt: String,
    @ColumnInfo(name = "payload_json")
    val payloadJson: String
)
