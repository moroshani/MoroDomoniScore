package com.morodomino.android.ui.screens.app

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.morodomino.android.domain.QuickGameMode
import com.morodomino.android.ui.AppUiState
import com.morodomino.android.ui.components.DominoMessagePanel
import com.morodomino.android.ui.screens.profile.ProfileScreen
import com.morodomino.android.ui.screens.quickgame.QuickGameScreen
import com.morodomino.android.ui.screens.settings.SettingsScreen

private enum class AppRoute(val label: String) {
    Game("بازی"),
    Profile("پروفایل"),
    Settings("تنظیمات")
}

@Composable
fun AppShell(
    state: AppUiState,
    onLogout: () -> Unit,
    onStartQuickGame: (QuickGameMode, List<String>, Int) -> Unit,
    onAddRound: (List<Int>) -> Unit,
    onResetQuickGame: () -> Unit,
    onUpdateProfile: (String, String, String) -> Unit,
    onChangePassword: (String, String) -> Unit,
    onThemeChanged: (String) -> Unit,
    onSoundChanged: (Boolean) -> Unit,
    onHapticsChanged: (Boolean) -> Unit,
    onNotificationsChanged: (Boolean) -> Unit,
    onRegisterPasskey: () -> Unit,
    onSensitiveConfirm: () -> Unit,
    onRefreshPasskeys: () -> Unit,
    onRemovePasskey: (String) -> Unit
) {
    var route by remember { mutableStateOf(AppRoute.Game) }

    Scaffold(
        containerColor = MaterialTheme.colorScheme.background,
        bottomBar = {
            NavigationBar(
                containerColor = MaterialTheme.colorScheme.surface,
                tonalElevation = 1.dp
            ) {
                AppRoute.entries.forEach { item ->
                    NavigationBarItem(
                        selected = route == item,
                        onClick = { route = item },
                        icon = { Text(itemSymbol(item), fontWeight = FontWeight.Bold) },
                        label = { Text(item.label, style = MaterialTheme.typography.labelLarge) }
                    )
                }
            }
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            StatusStrip(state = state)
            Box(modifier = Modifier.fillMaxSize()) {
                when (route) {
                    AppRoute.Game -> QuickGameScreen(
                        state = state,
                        contentPadding = PaddingValues(start = 14.dp, top = 12.dp, end = 14.dp, bottom = 14.dp),
                        onStartQuickGame = onStartQuickGame,
                        onAddRound = onAddRound,
                        onResetQuickGame = onResetQuickGame
                    )

                    AppRoute.Profile -> ProfileScreen(
                        state = state,
                        contentPadding = PaddingValues(start = 14.dp, top = 12.dp, end = 14.dp, bottom = 14.dp),
                        onUpdateProfile = onUpdateProfile,
                        onChangePassword = onChangePassword,
                        onRegisterPasskey = onRegisterPasskey,
                        onSensitiveConfirm = onSensitiveConfirm,
                        onRefreshPasskeys = onRefreshPasskeys,
                        onRemovePasskey = onRemovePasskey,
                        onLogout = onLogout
                    )

                    AppRoute.Settings -> SettingsScreen(
                        state = state,
                        contentPadding = PaddingValues(start = 14.dp, top = 12.dp, end = 14.dp, bottom = 14.dp),
                        onThemeChanged = onThemeChanged,
                        onSoundChanged = onSoundChanged,
                        onHapticsChanged = onHapticsChanged,
                        onNotificationsChanged = onNotificationsChanged
                    )
                }
            }
        }
    }
}

@Composable
private fun StatusStrip(state: AppUiState) {
    val error = state.errorCode
    val message = state.statusMessage
    if (error == null && message == null) return
    DominoMessagePanel(
        title = if (error != null) "خطا" else "وضعیت",
        message = message ?: error ?: "",
        isError = error != null,
        modifier = Modifier.padding(start = 14.dp, top = 10.dp, end = 14.dp)
    )
}

private fun itemSymbol(route: AppRoute): String {
    return when (route) {
        AppRoute.Game -> "ب"
        AppRoute.Profile -> "پ"
        AppRoute.Settings -> "ت"
    }
}
