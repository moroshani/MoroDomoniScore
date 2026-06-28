package com.morodomino.android.domain

data class QuickGameScoreResult(
    val nextScores: List<Int>,
    val winnerIndex: Int?,
    val tieBreakerRequired: Boolean
)

fun calculateQuickGameScore(
    currentScores: List<Int>,
    pointsBySide: List<Int>,
    pointCap: Int
): QuickGameScoreResult {
    require(currentScores.size == pointsBySide.size) { "Score and point lists must have the same size." }

    val normalizedPoints = pointsBySide.map { it.coerceAtLeast(0) }
    val nextScores = currentScores.mapIndexed { index, score -> score + normalizedPoints[index] }
    val maxScore = nextScores.maxOrNull() ?: 0

    if (maxScore < pointCap) {
        return QuickGameScoreResult(
            nextScores = nextScores,
            winnerIndex = null,
            tieBreakerRequired = false
        )
    }

    val winnerCandidates = nextScores.mapIndexedNotNull { index, score ->
        index.takeIf { score == maxScore }
    }

    return QuickGameScoreResult(
        nextScores = nextScores,
        winnerIndex = winnerCandidates.singleOrNull(),
        tieBreakerRequired = winnerCandidates.size > 1
    )
}
