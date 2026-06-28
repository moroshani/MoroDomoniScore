package com.morodomino.android.ui.screens.settings

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.morodomino.android.ui.AppUiState
import com.morodomino.android.ui.components.DominoPanel
import com.morodomino.android.ui.components.DominoSegmentedControl

@Composable
fun SettingsScreen(
    state: AppUiState,
    contentPadding: PaddingValues,
    onThemeChanged: (String) -> Unit,
    onSoundChanged: (Boolean) -> Unit,
    onHapticsChanged: (Boolean) -> Unit,
    onNotificationsChanged: (Boolean) -> Unit
) {
    val themeOptions = listOf("روشن", "تاریک", "سیستم")
    val selectedTheme = when (state.theme) {
        "light" -> 0
        "dark" -> 1
        else -> 2
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(contentPadding),
        verticalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
            Text("تنظیمات", style = MaterialTheme.typography.displaySmall)
            Text(
                "ترجیحات محلی برنامه",
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }

        DominoPanel {
            Text("پوسته", style = MaterialTheme.typography.titleLarge)
            DominoSegmentedControl(
                options = themeOptions,
                selectedIndex = selectedTheme,
                onSelected = { index ->
                    onThemeChanged(
                        when (index) {
                            0 -> "light"
                            1 -> "dark"
                            else -> "system"
                        }
                    )
                }
            )
        }

        DominoPanel {
            Text("رفتار برنامه", style = MaterialTheme.typography.titleLarge)
            SettingSwitchRow(
                title = "صدا",
                value = state.soundEnabled,
                onChanged = onSoundChanged
            )
            SettingSwitchRow(
                title = "لرزش",
                value = state.hapticsEnabled,
                onChanged = onHapticsChanged
            )
            SettingSwitchRow(
                title = "اعلان‌ها",
                value = state.notificationsEnabled,
                onChanged = onNotificationsChanged
            )
        }
    }
}

@Composable
private fun SettingSwitchRow(
    title: String,
    value: Boolean,
    onChanged: (Boolean) -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(MaterialTheme.colorScheme.surfaceVariant, MaterialTheme.shapes.medium)
            .padding(horizontal = 12.dp, vertical = 8.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(title, style = MaterialTheme.typography.titleMedium)
        Switch(checked = value, onCheckedChange = onChanged)
    }
}
