package com.morodomino.android.domain

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

class QuickGameScoringTest {
    @Test
    fun doesNotSelectWinnerBeforePointCap() {
        val result = calculateQuickGameScore(
            currentScores = listOf(40, 50),
            pointsBySide = listOf(10, 20),
            pointCap = 101
        )

        assertEquals(listOf(50, 70), result.nextScores)
        assertNull(result.winnerIndex)
        assertFalse(result.tieBreakerRequired)
    }

    @Test
    fun selectsUniqueHighestScoreAtPointCap() {
        val result = calculateQuickGameScore(
            currentScores = listOf(95, 90),
            pointsBySide = listOf(6, 20),
            pointCap = 101
        )

        assertEquals(listOf(101, 110), result.nextScores)
        assertEquals(1, result.winnerIndex)
        assertFalse(result.tieBreakerRequired)
    }

    @Test
    fun requiresTieBreakerWhenHighestScoresAreEqualOverCap() {
        val result = calculateQuickGameScore(
            currentScores = listOf(95, 100, 80),
            pointsBySide = listOf(10, 5, 20),
            pointCap = 101
        )

        assertEquals(listOf(105, 105, 100), result.nextScores)
        assertNull(result.winnerIndex)
        assertTrue(result.tieBreakerRequired)
    }

    @Test
    fun clampsNegativeRoundInputToZero() {
        val result = calculateQuickGameScore(
            currentScores = listOf(10, 10),
            pointsBySide = listOf(-5, 8),
            pointCap = 101
        )

        assertEquals(listOf(10, 18), result.nextScores)
    }
}
