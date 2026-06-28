package com.morodomino.android.data.repository

import com.morodomino.android.domain.QuickGameSession
import com.morodomino.android.domain.QuickGameMode

interface QuickGameRepository {
    suspend fun getActiveSession(): QuickGameSession?
    suspend fun startSession(mode: QuickGameMode, sideNames: List<String>, pointCap: Int): QuickGameSession
    suspend fun addRound(sessionId: String, pointsBySide: List<Int>, nextScores: List<Int>, roundNumber: Int)
    suspend fun resetSession(sessionId: String)
}
