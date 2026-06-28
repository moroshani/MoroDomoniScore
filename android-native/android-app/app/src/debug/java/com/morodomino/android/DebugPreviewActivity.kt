package com.morodomino.android

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.morodomino.android.domain.AuthSession
import com.morodomino.android.domain.QuickGameMode
import com.morodomino.android.domain.User
import com.morodomino.android.ui.AppUiState
import com.morodomino.android.ui.QuickGameUiState
import com.morodomino.android.ui.screens.app.AppShell
import com.morodomino.android.ui.screens.auth.AuthScreen
import com.morodomino.android.ui.screens.profile.ProfileScreen
import com.morodomino.android.ui.screens.quickgame.QuickGameScreen
import com.morodomino.android.ui.screens.settings.SettingsScreen
import com.morodomino.android.ui.theme.DominoyarTheme

class DebugPreviewActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val screen = intent.getStringExtra("screen") ?: "shell"
        val theme = intent.getStringExtra("theme") ?: "light"
        val state = previewState(
            theme = theme,
            gameStarted = screen == "scoring" || screen == "scoring-tie" || screen == "shell",
            tieBreaker = screen == "scoring-tie"
        )

        setContent {
            DominoyarTheme(themeMode = theme) {
                Surface(modifier = Modifier.fillMaxSize(), color = MaterialTheme.colorScheme.background) {
                    when (screen) {
                        "auth", "register" -> AuthScreen(
                            state = state.copy(session = null),
                            onLogin = { _, _ -> },
                            onRegister = { _, _, _, _ -> },
                            onLoginWithBiometric = {},
                            onLoginWithPasskey = {},
                            initialRoute = if (screen == "register") "register" else "login"
                        )

                        "game" -> QuickGameScreen(
                            state = state.copy(quickGame = QuickGameUiState()),
                            contentPadding = previewPadding(),
                            onStartQuickGame = { _, _, _ -> },
                            onAddRound = {},
                            onResetQuickGame = {}
                        )

                        "scoring", "scoring-tie" -> QuickGameScreen(
                            state = state,
                            contentPadding = previewPadding(),
                            onStartQuickGame = { _, _, _ -> },
                            onAddRound = {},
                            onResetQuickGame = {}
                        )

                        "profile" -> ProfileScreen(
                            state = state,
                            contentPadding = previewPadding(),
                            onUpdateProfile = { _, _, _ -> },
                            onChangePassword = { _, _ -> },
                            onRegisterPasskey = {},
                            onSensitiveConfirm = {},
                            onRefreshPasskeys = {},
                            onRemovePasskey = {},
                            onLogout = {}
                        )

                        "settings" -> SettingsScreen(
                            state = state,
                            contentPadding = previewPadding(),
                            onThemeChanged = {},
                            onSoundChanged = {},
                            onHapticsChanged = {},
                            onNotificationsChanged = {}
                        )

                        else -> AppShell(
                            state = state,
                            onLogout = {},
                            onStartQuickGame = { _, _, _ -> },
                            onAddRound = {},
                            onResetQuickGame = {},
                            onUpdateProfile = { _, _, _ -> },
                            onChangePassword = { _, _ -> },
                            onThemeChanged = {},
                            onSoundChanged = {},
                            onHapticsChanged = {},
                            onNotificationsChanged = {},
                            onRegisterPasskey = {},
                            onSensitiveConfirm = {},
                            onRefreshPasskeys = {},
                            onRemovePasskey = {}
                        )
                    }
                }
            }
        }
    }
}

private fun previewPadding(): PaddingValues {
    return PaddingValues(start = 18.dp, top = 14.dp, end = 18.dp, bottom = 18.dp)
}

private fun previewState(theme: String, gameStarted: Boolean, tieBreaker: Boolean): AppUiState {
    return AppUiState(
        bootstrapped = true,
        session = AuthSession(
            token = "debug-preview",
            user = User(
                id = "debug-user",
                name = "کاربر نمونه",
                username = "sample",
                email = "sample@example.com",
                avatar = null,
                role = "user",
                isImmortal = false
            )
        ),
        theme = theme,
        soundEnabled = true,
        hapticsEnabled = true,
        notificationsEnabled = false,
        quickGame = if (gameStarted) {
            val scores = if (tieBreaker) listOf(151, 151) else listOf(42, 67)
            QuickGameUiState(
                activeSessionId = "debug-session",
                mode = QuickGameMode.FOUR_PLAYER_TWO_VS_TWO,
                sideNames = listOf("تیم آبی", "تیم سفید"),
                pointCap = 151,
                scores = scores,
                winnerIndex = null,
                tieBreakerRequired = tieBreaker,
                rounds = if (tieBreaker) 6 else 2,
                gameStarted = true
            )
        } else {
            QuickGameUiState()
        },
        biometricAvailable = true,
        passkeyAvailable = true
    )
}
