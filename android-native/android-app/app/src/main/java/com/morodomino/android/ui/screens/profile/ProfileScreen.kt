package com.morodomino.android.ui.screens.profile

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import com.morodomino.android.ui.AppUiState
import com.morodomino.android.ui.components.DominoPanel
import com.morodomino.android.ui.components.DominoPrimaryButton
import com.morodomino.android.ui.components.DominoSecondaryButton
import com.morodomino.android.ui.components.DominoTextField

@Composable
fun ProfileScreen(
    state: AppUiState,
    contentPadding: PaddingValues,
    onUpdateProfile: (String, String, String) -> Unit,
    onChangePassword: (String, String) -> Unit,
    onRegisterPasskey: () -> Unit,
    onSensitiveConfirm: () -> Unit,
    onRefreshPasskeys: () -> Unit,
    onRemovePasskey: (String) -> Unit,
    onLogout: () -> Unit
) {
    val user = state.session?.user ?: return
    var name by remember { mutableStateOf(user.name) }
    var username by remember { mutableStateOf(user.username) }
    var email by remember { mutableStateOf(user.email) }
    var currentPassword by remember { mutableStateOf("") }
    var newPassword by remember { mutableStateOf("") }

    LaunchedEffect(user.id, user.name, user.username, user.email) {
        name = user.name
        username = user.username
        email = user.email
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(contentPadding),
        verticalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(10.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(
                modifier = Modifier
                    .background(MaterialTheme.colorScheme.primaryContainer, CircleShape)
                    .padding(horizontal = 15.dp, vertical = 10.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = user.name.firstOrNull()?.toString() ?: "د",
                    style = MaterialTheme.typography.headlineSmall,
                    color = MaterialTheme.colorScheme.onPrimaryContainer
                )
            }
            Column(modifier = Modifier.weight(1f)) {
                Text(user.name, style = MaterialTheme.typography.titleLarge)
                Text("@${user.username}", style = MaterialTheme.typography.bodyLarge, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        }

        DominoPanel {
            Text("پروفایل", style = MaterialTheme.typography.titleLarge)
            DominoTextField(value = name, onValueChange = { name = it }, label = "نام")
            DominoTextField(value = username, onValueChange = { username = it }, label = "نام کاربری")
            DominoTextField(
                value = email,
                onValueChange = { email = it },
                label = "ایمیل",
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email)
            )
            DominoPrimaryButton(
                text = "ذخیره پروفایل",
                onClick = { onUpdateProfile(name, username, email) },
                busy = state.busy,
                busyText = "در حال ذخیره"
            )
        }

        DominoPanel {
            Text("رمز عبور", style = MaterialTheme.typography.titleLarge)
            DominoTextField(
                value = currentPassword,
                onValueChange = { currentPassword = it },
                label = "رمز فعلی",
                visualTransformation = PasswordVisualTransformation()
            )
            DominoTextField(
                value = newPassword,
                onValueChange = { newPassword = it },
                label = "رمز جدید",
                visualTransformation = PasswordVisualTransformation()
            )
            DominoPrimaryButton(
                text = "تغییر رمز",
                onClick = {
                    onChangePassword(currentPassword, newPassword)
                    currentPassword = ""
                    newPassword = ""
                },
                busy = state.busy,
                busyText = "در حال تغییر"
            )
        }

        DominoPanel {
            Text("امنیت حساب", style = MaterialTheme.typography.titleLarge)
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                DominoSecondaryButton(
                    text = "ثبت پاس‌کی",
                    onClick = onRegisterPasskey,
                    enabled = state.passkeyAvailable,
                    modifier = Modifier.weight(1f)
                )
                DominoSecondaryButton(
                    text = "تأیید بیومتریک",
                    onClick = onSensitiveConfirm,
                    enabled = state.biometricAvailable,
                    modifier = Modifier.weight(1f)
                )
            }
            DominoSecondaryButton(
                text = "بازخوانی پاس‌کی‌ها",
                onClick = onRefreshPasskeys
            )
            if (state.passkeys.isEmpty()) {
                Text(
                    "پاس‌کی ثبت نشده است.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            } else {
                state.passkeys.forEach { passkey ->
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(MaterialTheme.colorScheme.surfaceVariant, MaterialTheme.shapes.medium)
                            .padding(12.dp),
                        verticalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Text(passkey.deviceType ?: "دستگاه", style = MaterialTheme.typography.titleMedium)
                        Text(
                            passkey.lastUsedAt ?: passkey.createdAt ?: passkey.id.take(12),
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        DominoSecondaryButton(
                            text = "حذف",
                            onClick = { onRemovePasskey(passkey.id) },
                            contentColor = MaterialTheme.colorScheme.error
                        )
                    }
                }
            }
        }

        DominoSecondaryButton(
            text = "خروج از حساب",
            onClick = onLogout,
            contentColor = MaterialTheme.colorScheme.error
        )
    }
}
