package com.morodomino.android.ui.screens.quickgame

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.morodomino.android.domain.QuickGameMode
import com.morodomino.android.ui.AppUiState
import com.morodomino.android.ui.components.DominoPanel
import com.morodomino.android.ui.components.DominoPrimaryButton
import com.morodomino.android.ui.components.DominoSecondaryButton
import com.morodomino.android.ui.components.DominoSegmentedControl
import com.morodomino.android.ui.components.DominoTextField

@Composable
fun QuickGameScreen(
    state: AppUiState,
    contentPadding: PaddingValues,
    onStartQuickGame: (QuickGameMode, List<String>, Int) -> Unit,
    onAddRound: (List<Int>) -> Unit,
    onResetQuickGame: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(contentPadding),
        verticalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        GameHeader(state)
        if (state.quickGame.gameStarted) {
            ScoreboardPanel(
                state = state,
                onAddRound = onAddRound,
                onResetQuickGame = onResetQuickGame
            )
        } else {
            GameSetupPanel(
                busy = state.busy,
                onStartQuickGame = onStartQuickGame
            )
        }
    }
}

@Composable
private fun GameHeader(state: AppUiState) {
    val name = state.session?.user?.name ?: "کاربر"
    Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
        Text(
            text = "دومینویار",
            style = MaterialTheme.typography.headlineMedium,
            color = MaterialTheme.colorScheme.onBackground
        )
        Text(
            text = name,
            style = MaterialTheme.typography.bodyLarge,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}

@Composable
private fun GameSetupPanel(
    busy: Boolean,
    onStartQuickGame: (QuickGameMode, List<String>, Int) -> Unit
) {
    var selectedMode by remember { mutableIntStateOf(0) }
    var pointCap by remember { mutableStateOf("101") }
    val names = remember { mutableStateListOf("", "", "") }
    val mode = when (selectedMode) {
        1 -> QuickGameMode.THREE_PLAYER
        2 -> QuickGameMode.FOUR_PLAYER_TWO_VS_TWO
        else -> QuickGameMode.TWO_PLAYER
    }
    val sideCount = if (mode == QuickGameMode.THREE_PLAYER) 3 else 2

    DominoPanel {
        Text("شروع بازی سریع", style = MaterialTheme.typography.titleLarge)
        DominoSegmentedControl(
            options = listOf("۲ نفره", "۳ نفره", "۲ به ۲"),
            selectedIndex = selectedMode,
            onSelected = { index ->
                selectedMode = index
                pointCap = if (index == 0) "101" else "151"
            }
        )
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            DominoTextField(
                value = pointCap,
                onValueChange = { pointCap = it.filter(Char::isDigit).take(4) },
                label = "امتیاز برد",
                keyboardOptions = KeyboardOptions.Default,
                modifier = Modifier.weight(1f)
            )
            MetricPill(
                label = "حالت",
                value = when (mode) {
                    QuickGameMode.TWO_PLAYER -> "۲P"
                    QuickGameMode.THREE_PLAYER -> "۳P"
                    QuickGameMode.FOUR_PLAYER_TWO_VS_TWO -> "۴P"
                },
                modifier = Modifier.weight(1f)
            )
        }
        repeat(sideCount) { index ->
            DominoTextField(
                value = names[index],
                onValueChange = { names[index] = it },
                label = if (mode == QuickGameMode.FOUR_PLAYER_TWO_VS_TWO) "نام تیم ${index + 1}" else "نام بازیکن ${index + 1}"
            )
        }
        DominoPrimaryButton(
            text = "شروع بازی",
            onClick = {
                onStartQuickGame(
                    mode,
                    names.take(sideCount),
                    pointCap.toIntOrNull() ?: if (mode == QuickGameMode.TWO_PLAYER) 101 else 151
                )
            },
            busy = busy,
            busyText = "در حال شروع"
        )
    }
}

@Composable
private fun ScoreboardPanel(
    state: AppUiState,
    onAddRound: (List<Int>) -> Unit,
    onResetQuickGame: () -> Unit
) {
    val game = state.quickGame
    val roundInputs = remember(game.activeSessionId) {
        mutableStateListOf(*Array(game.sideNames.size) { "" })
    }

    DominoPanel {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text("تابلوی امتیاز", style = MaterialTheme.typography.titleLarge)
                Text(
                    text = "دور ${game.rounds} از هدف ${game.pointCap}",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
            game.winnerIndex?.let {
                WinnerBadge(game.sideNames.getOrElse(it) { "برنده" })
            }
        }
        if (game.tieBreakerRequired) {
            Text(
                text = "بازی برابر است؛ تا تعیین برنده ادامه دهید.",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.tertiary
            )
        }

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            game.sideNames.forEachIndexed { index, name ->
                ScoreTile(
                    name = name,
                    score = game.scores.getOrElse(index) { 0 },
                    pointCap = game.pointCap,
                    modifier = Modifier.weight(1f)
                )
            }
        }

        Text("ثبت دور", style = MaterialTheme.typography.titleMedium)
        game.sideNames.forEachIndexed { index, name ->
            DominoTextField(
                value = roundInputs.getOrElse(index) { "" },
                onValueChange = { value ->
                    if (index < roundInputs.size) {
                        roundInputs[index] = value.filter(Char::isDigit).take(4)
                    }
                },
                label = name,
                keyboardOptions = KeyboardOptions.Default
            )
        }
        DominoPrimaryButton(
            text = "ثبت امتیازهای دور",
            onClick = {
                onAddRound(roundInputs.map { it.toIntOrNull() ?: 0 })
                roundInputs.indices.forEach { roundInputs[it] = "" }
            },
            enabled = game.winnerIndex == null
        )
        DominoSecondaryButton(
            text = "بازی جدید",
            onClick = onResetQuickGame,
            contentColor = MaterialTheme.colorScheme.error
        )
    }
}

@Composable
private fun ScoreTile(
    name: String,
    score: Int,
    pointCap: Int,
    modifier: Modifier = Modifier
) {
    val progress = (score.toFloat() / pointCap.toFloat()).coerceIn(0f, 1f)
    Column(
        modifier = modifier
            .background(MaterialTheme.colorScheme.surfaceVariant, RoundedCornerShape(14.dp))
            .padding(10.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .aspectRatio(1.05f)
                .background(MaterialTheme.colorScheme.surface, RoundedCornerShape(12.dp)),
            contentAlignment = Alignment.Center
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    text = score.toString(),
                    style = MaterialTheme.typography.headlineMedium,
                    color = MaterialTheme.colorScheme.primary
                )
                Text(
                    text = "${(progress * 100).toInt()}٪",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
        Text(
            text = name,
            style = MaterialTheme.typography.labelLarge,
            color = MaterialTheme.colorScheme.onSurface,
            textAlign = TextAlign.Center,
            maxLines = 2
        )
    }
}

@Composable
private fun MetricPill(label: String, value: String, modifier: Modifier = Modifier) {
    Column(
        modifier = modifier
            .height(52.dp)
            .background(MaterialTheme.colorScheme.primaryContainer, RoundedCornerShape(12.dp))
            .padding(horizontal = 12.dp, vertical = 7.dp),
        verticalArrangement = Arrangement.Center
    ) {
        Text(label, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onPrimaryContainer)
        Text(value, style = MaterialTheme.typography.titleMedium, color = MaterialTheme.colorScheme.onPrimaryContainer)
    }
}

@Composable
private fun WinnerBadge(name: String) {
    Row(
        modifier = Modifier
            .background(MaterialTheme.colorScheme.secondaryContainer, CircleShape)
            .padding(horizontal = 10.dp, vertical = 6.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(5.dp)
    ) {
        Box(
            modifier = Modifier
                .width(7.dp)
                .height(7.dp)
                .background(Color(0xFF10B981), CircleShape)
        )
        Text(name, style = MaterialTheme.typography.labelLarge, color = MaterialTheme.colorScheme.onSecondaryContainer)
    }
}
