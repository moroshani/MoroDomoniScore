package com.morodomino.android

import android.os.Bundle
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.fragment.app.FragmentActivity
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.lifecycleScope
import com.morodomino.android.data.local.DominoyarDatabase
import com.morodomino.android.data.preferences.AppPreferences
import com.morodomino.android.data.repository.AuthRepositoryImpl
import com.morodomino.android.data.repository.QuickGameRepositoryImpl
import com.morodomino.android.data.security.TokenStore
import com.morodomino.android.notifications.AndroidNotificationManager
import com.morodomino.android.security.BiometricAuthManager
import com.morodomino.android.security.BiometricPromptManager
import com.morodomino.android.security.PasskeyAuthCoordinator
import com.morodomino.android.security.PasskeyManager
import com.morodomino.android.ui.AppUiState
import com.morodomino.android.ui.AppViewModel
import com.morodomino.android.ui.AppViewModelFactory
import com.morodomino.android.ui.screens.app.AppShell
import com.morodomino.android.ui.screens.auth.AuthScreen
import com.morodomino.android.ui.theme.DominoyarTheme
import kotlinx.coroutines.launch

class MainActivity : FragmentActivity() {
    private lateinit var tokenStore: TokenStore
    private lateinit var passkeyCoordinator: PasskeyAuthCoordinator
    private lateinit var biometricPromptManager: BiometricPromptManager
    private lateinit var notificationManager: AndroidNotificationManager

    private val viewModel: AppViewModel by viewModels {
        val database = DominoyarDatabase.getInstance(applicationContext)
        val biometricManager = BiometricAuthManager(applicationContext)
        val passkeyManager = PasskeyManager(applicationContext)
        AppViewModelFactory(
            authRepository = AuthRepositoryImpl(TokenStore(applicationContext)),
            quickGameRepository = QuickGameRepositoryImpl(database.quickGameDao()),
            preferences = AppPreferences(applicationContext),
            biometricAvailableProvider = { biometricManager.isBiometricAvailable() },
            passkeyAvailableProvider = { passkeyManager.isAvailable() }
        )
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        tokenStore = TokenStore(applicationContext)
        passkeyCoordinator = PasskeyAuthCoordinator(this)
        biometricPromptManager = BiometricPromptManager(this)
        notificationManager = AndroidNotificationManager(applicationContext)
        notificationManager.ensureChannels()

        setContent {
            val state by viewModel.uiState.collectAsStateWithLifecycle()
            DominoyarTheme(themeMode = state.theme) {
                Surface(modifier = Modifier.fillMaxSize(), color = MaterialTheme.colorScheme.background) {
                    AppRoot(
                        state = state,
                        onLogin = viewModel::login,
                        onRegister = viewModel::register,
                        onLoginWithBiometric = ::loginWithBiometric,
                        onLoginWithPasskey = ::loginWithPasskey,
                        onRegisterPasskey = ::registerPasskey,
                        onSensitiveConfirm = ::confirmSensitiveAction,
                        onLogout = viewModel::logout,
                        onRefreshPasskeys = viewModel::refreshPasskeys,
                        onRemovePasskey = ::removePasskey,
                        onStartQuickGame = viewModel::startQuickGame,
                        onAddRound = viewModel::addRound,
                        onResetQuickGame = viewModel::resetQuickGame,
                        onUpdateProfile = viewModel::updateProfile,
                        onChangePassword = viewModel::changePassword,
                        onThemeChanged = viewModel::setTheme,
                        onSoundChanged = viewModel::setSoundEnabled,
                        onHapticsChanged = viewModel::setHapticsEnabled,
                        onNotificationsChanged = ::setNotificationsEnabled
                    )
                }
            }
        }
    }

    private fun loginWithBiometric() {
        lifecycleScope.launch {
            val ok = biometricPromptManager.authenticate(
                title = "ورود بیومتریک",
                subtitle = "برای ورود سریع هویت خود را تأیید کنید"
            )
            if (ok) {
                val savedToken = tokenStore.readToken()
                if (!savedToken.isNullOrBlank()) {
                    viewModel.bootstrap()
                } else {
                    viewModel.reportExternalInfo("جلسه ذخیره‌شده‌ای برای ورود بیومتریک وجود ندارد.")
                }
            } else {
                viewModel.reportExternalError("BIOMETRIC_AUTH_FAILED", "تأیید بیومتریک انجام نشد.")
            }
        }
    }

    private fun loginWithPasskey(identifier: String) {
        lifecycleScope.launch {
            if (identifier.isBlank()) {
                viewModel.reportExternalError("PASSKEY_IDENTIFIER_REQUIRED", "برای ورود با پاس‌کی، ایمیل یا نام کاربری را وارد کنید.")
                return@launch
            }
            val result = runCatching { passkeyCoordinator.loginWithPasskey(identifier) }
            val data = result.getOrNull()
            if (result.isSuccess && data != null && data.token.isNotBlank()) {
                tokenStore.saveToken(data.token)
                viewModel.bootstrap()
            } else {
                viewModel.reportExternalError("PASSKEY_LOGIN_FAILED", "ورود با پاس‌کی انجام نشد.")
            }
        }
    }

    private fun registerPasskey() {
        lifecycleScope.launch {
            val token = tokenStore.readToken()
            if (token.isNullOrBlank()) {
                viewModel.reportExternalError("PASSKEY_REGISTER_NO_SESSION", "برای ثبت پاس‌کی باید وارد حساب باشید.")
                return@launch
            }
            val result = runCatching { passkeyCoordinator.registerPasskey(token) }
            if (result.isSuccess && result.getOrDefault(false)) {
                viewModel.reportExternalInfo("پاس‌کی با موفقیت ثبت شد.")
                notificationManager.notifySecurityEvent("پاس‌کی ثبت شد", "یک پاس‌کی جدید برای حساب شما ثبت شد.")
                viewModel.refreshPasskeys()
            } else {
                viewModel.reportExternalError("PASSKEY_REGISTER_FAILED", "ثبت پاس‌کی کامل نشد.")
            }
        }
    }

    private fun confirmSensitiveAction() {
        lifecycleScope.launch {
            val ok = biometricPromptManager.authenticate(
                title = "تأیید عملیات حساس",
                subtitle = "برای ادامه، هویت خود را تأیید کنید"
            )
            if (ok) {
                viewModel.reportExternalInfo("تأیید بیومتریک موفق بود.")
            } else {
                viewModel.reportExternalError("SENSITIVE_BIOMETRIC_FAILED", "تأیید بیومتریک انجام نشد.")
            }
        }
    }

    private fun removePasskey(passkeyId: String) {
        lifecycleScope.launch {
            val ok = biometricPromptManager.authenticate(
                title = "حذف پاس‌کی",
                subtitle = "برای حذف پاس‌کی، هویت خود را تأیید کنید"
            )
            if (ok) {
                viewModel.removePasskey(passkeyId)
                notificationManager.notifySecurityEvent("پاس‌کی حذف شد", "یک پاس‌کی از حساب شما حذف شد.")
            } else {
                viewModel.reportExternalError("PASSKEY_DELETE_BIOMETRIC_FAILED", "حذف پاس‌کی لغو شد.")
            }
        }
    }

    private fun setNotificationsEnabled(enabled: Boolean) {
        viewModel.setNotificationsEnabled(enabled)
        if (enabled) {
            notificationManager.notifyGameReminder("اعلان‌ها فعال شد", "اعلان‌های امنیتی و یادآوری بازی فعال هستند.")
        }
    }
}

@Composable
private fun AppRoot(
    state: AppUiState,
    onLogin: (String, String) -> Unit,
    onRegister: (String, String, String, String) -> Unit,
    onLoginWithBiometric: () -> Unit,
    onLoginWithPasskey: (String) -> Unit,
    onRegisterPasskey: () -> Unit,
    onSensitiveConfirm: () -> Unit,
    onLogout: () -> Unit,
    onRefreshPasskeys: () -> Unit,
    onRemovePasskey: (String) -> Unit,
    onStartQuickGame: (com.morodomino.android.domain.QuickGameMode, List<String>, Int) -> Unit,
    onAddRound: (List<Int>) -> Unit,
    onResetQuickGame: () -> Unit,
    onUpdateProfile: (String, String, String) -> Unit,
    onChangePassword: (String, String) -> Unit,
    onThemeChanged: (String) -> Unit,
    onSoundChanged: (Boolean) -> Unit,
    onHapticsChanged: (Boolean) -> Unit,
    onNotificationsChanged: (Boolean) -> Unit
) {
    if (!state.bootstrapped) {
        CenterMessage("در حال آماده‌سازی...")
        return
    }

    if (state.session == null) {
        AuthScreen(
            state = state,
            onLogin = onLogin,
            onRegister = onRegister,
            onLoginWithBiometric = onLoginWithBiometric,
            onLoginWithPasskey = onLoginWithPasskey
        )
        return
    }

    AppShell(
        state = state,
        onLogout = onLogout,
        onStartQuickGame = onStartQuickGame,
        onAddRound = onAddRound,
        onResetQuickGame = onResetQuickGame,
        onUpdateProfile = onUpdateProfile,
        onChangePassword = onChangePassword,
        onThemeChanged = onThemeChanged,
        onSoundChanged = onSoundChanged,
        onHapticsChanged = onHapticsChanged,
        onNotificationsChanged = onNotificationsChanged,
        onRegisterPasskey = onRegisterPasskey,
        onSensitiveConfirm = onSensitiveConfirm,
        onRefreshPasskeys = onRefreshPasskeys,
        onRemovePasskey = onRemovePasskey
    )
}

@Composable
private fun CenterMessage(message: String) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(text = message, style = MaterialTheme.typography.headlineSmall)
    }
}
