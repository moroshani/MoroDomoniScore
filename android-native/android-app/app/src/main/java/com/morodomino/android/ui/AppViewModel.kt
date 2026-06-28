package com.morodomino.android.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.morodomino.android.data.preferences.AppPreferences
import com.morodomino.android.data.repository.AuthRepository
import com.morodomino.android.data.repository.QuickGameRepository
import com.morodomino.android.domain.AuthSession
import com.morodomino.android.domain.PasswordChange
import com.morodomino.android.domain.PasskeyCredential
import com.morodomino.android.domain.ProfileUpdate
import com.morodomino.android.domain.QuickGameMode
import com.morodomino.android.domain.QuickGameSession
import com.morodomino.android.domain.calculateQuickGameScore
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch

data class QuickGameUiState(
    val activeSessionId: String? = null,
    val mode: QuickGameMode? = null,
    val sideNames: List<String> = emptyList(),
    val pointCap: Int = 101,
    val scores: List<Int> = emptyList(),
    val winnerIndex: Int? = null,
    val tieBreakerRequired: Boolean = false,
    val rounds: Int = 0,
    val gameStarted: Boolean = false
)

data class AppUiState(
    val bootstrapped: Boolean = false,
    val session: AuthSession? = null,
    val activeQuickGame: QuickGameSession? = null,
    val theme: String = "system",
    val soundEnabled: Boolean = true,
    val hapticsEnabled: Boolean = true,
    val notificationsEnabled: Boolean = false,
    val errorCode: String? = null,
    val statusMessage: String? = null,
    val busy: Boolean = false,
    val quickGame: QuickGameUiState = QuickGameUiState(),
    val biometricAvailable: Boolean = false,
    val passkeyAvailable: Boolean = false,
    val passkeys: List<PasskeyCredential> = emptyList()
)

private fun QuickGameSession.toUiState(rounds: Int = roundCount): QuickGameUiState {
    val orderedSides = sides.sortedBy { it.sideIndex }
    val scores = orderedSides.map { it.currentGameScore }
    val scoreResult = calculateQuickGameScore(
        currentScores = scores,
        pointsBySide = List(scores.size) { 0 },
        pointCap = pointCap
    )
    return QuickGameUiState(
        activeSessionId = id,
        mode = mode,
        sideNames = orderedSides.map { it.displayName },
        pointCap = pointCap,
        scores = scores,
        winnerIndex = scoreResult.winnerIndex,
        tieBreakerRequired = scoreResult.tieBreakerRequired,
        rounds = rounds,
        gameStarted = true
    )
}

class AppViewModel(
    private val authRepository: AuthRepository,
    private val quickGameRepository: QuickGameRepository,
    private val preferences: AppPreferences,
    private val biometricAvailableProvider: () -> Boolean,
    private val passkeyAvailableProvider: () -> Boolean
) : ViewModel() {
    private val _uiState = MutableStateFlow(AppUiState())
    val uiState: StateFlow<AppUiState> = _uiState.asStateFlow()

    init {
        bootstrap()
    }

    fun bootstrap() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(busy = true)
            try {
                val session = authRepository.bootstrapSession()
                val quickGame = quickGameRepository.getActiveSession()
                val theme = preferences.theme.first()
                val sound = preferences.soundEnabled.first()
                val haptics = preferences.hapticsEnabled.first()
                val notifications = preferences.notificationsEnabled.first()
                val passkeys = if (session != null) authRepository.listPasskeys() else emptyList()

                _uiState.value = _uiState.value.copy(
                    bootstrapped = true,
                    session = session,
                    activeQuickGame = quickGame,
                    quickGame = quickGame?.toUiState() ?: QuickGameUiState(),
                    theme = theme,
                    soundEnabled = sound,
                    hapticsEnabled = haptics,
                    notificationsEnabled = notifications,
                    errorCode = null,
                    statusMessage = null,
                    busy = false,
                    biometricAvailable = biometricAvailableProvider(),
                    passkeyAvailable = passkeyAvailableProvider(),
                    passkeys = passkeys
                )
            } catch (error: Exception) {
                _uiState.value = _uiState.value.copy(
                    bootstrapped = true,
                    errorCode = error.message ?: "BOOTSTRAP_FAILED",
                    busy = false,
                    biometricAvailable = biometricAvailableProvider(),
                    passkeyAvailable = passkeyAvailableProvider()
                )
            }
        }
    }

    fun login(identifier: String, password: String) {
        if (identifier.isBlank() || password.isBlank()) {
            _uiState.value = _uiState.value.copy(
                errorCode = "LOGIN_INPUT_REQUIRED",
                statusMessage = "برای ورود، ایمیل یا نام کاربری و رمز عبور لازم است."
            )
            return
        }
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(busy = true, errorCode = null, statusMessage = null)
            try {
                val session = authRepository.login(identifier.trim(), password)
                val quickGame = quickGameRepository.getActiveSession()
                _uiState.value = _uiState.value.copy(
                    session = session,
                    activeQuickGame = quickGame,
                    quickGame = quickGame?.toUiState() ?: QuickGameUiState(),
                    busy = false,
                    errorCode = null,
                    statusMessage = null
                )
            } catch (error: Exception) {
                _uiState.value = _uiState.value.copy(
                    busy = false,
                    errorCode = error.message ?: "LOGIN_FAILED",
                    statusMessage = "ورود انجام نشد. دوباره با رمز عبور تلاش کنید."
                )
            }
        }
    }

    fun register(name: String, username: String, email: String, password: String) {
        if (name.isBlank() || username.isBlank() || email.isBlank() || password.isBlank()) {
            _uiState.value = _uiState.value.copy(
                errorCode = "REGISTER_INPUT_REQUIRED",
                statusMessage = "همه فیلدها برای ثبت‌نام لازم هستند."
            )
            return
        }
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(busy = true, errorCode = null, statusMessage = null)
            try {
                val session = authRepository.register(name.trim(), username.trim(), email.trim(), password)
                _uiState.value = _uiState.value.copy(
                    session = session,
                    busy = false,
                    errorCode = null,
                    statusMessage = null
                )
            } catch (error: Exception) {
                _uiState.value = _uiState.value.copy(
                    busy = false,
                    errorCode = error.message ?: "REGISTER_FAILED",
                    statusMessage = "ثبت‌نام انجام نشد. دوباره تلاش کنید."
                )
            }
        }
    }

    fun logout() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(busy = true)
            try {
                authRepository.logout()
                _uiState.value = _uiState.value.copy(
                    session = null,
                    quickGame = QuickGameUiState(),
                    passkeys = emptyList(),
                    busy = false,
                    errorCode = null,
                    statusMessage = null
                )
            } catch (error: Exception) {
                _uiState.value = _uiState.value.copy(
                    busy = false,
                    errorCode = error.message ?: "LOGOUT_FAILED",
                    statusMessage = "خروج انجام نشد."
                )
            }
        }
    }

    fun startQuickGame(mode: QuickGameMode, rawNames: List<String>, pointCap: Int) {
        val requiredSides = when (mode) {
            QuickGameMode.TWO_PLAYER -> 2
            QuickGameMode.THREE_PLAYER -> 3
            QuickGameMode.FOUR_PLAYER_TWO_VS_TWO -> 2
        }
        if (rawNames.size != requiredSides) {
            _uiState.value = _uiState.value.copy(errorCode = "INVALID_SIDE_COUNT")
            return
        }

        val fallback = if (mode == QuickGameMode.FOUR_PLAYER_TWO_VS_TWO) "تیم" else "بازیکن"
        val names = rawNames.mapIndexed { index, value -> value.trim().ifBlank { "$fallback ${index + 1}" } }
        val safePointCap = pointCap.coerceAtLeast(1)

        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(busy = true, errorCode = null, statusMessage = null)
            try {
                val session = quickGameRepository.startSession(mode, names, safePointCap)
                _uiState.value = _uiState.value.copy(
                    activeQuickGame = session,
                    quickGame = session.toUiState(),
                    busy = false,
                    errorCode = null,
                    statusMessage = null
                )
            } catch (error: Exception) {
                _uiState.value = _uiState.value.copy(
                    busy = false,
                    errorCode = error.message ?: "QUICK_GAME_START_FAILED",
                    statusMessage = "شروع بازی انجام نشد."
                )
            }
        }
    }

    fun addRound(pointsBySide: List<Int>) {
        val state = _uiState.value.quickGame
        if (!state.gameStarted || state.mode == null || state.scores.isEmpty()) return
        if (pointsBySide.size != state.scores.size) {
            _uiState.value = _uiState.value.copy(
                errorCode = "INVALID_ROUND_INPUT",
                statusMessage = "ورودی این دور معتبر نیست."
            )
            return
        }

        val normalized = pointsBySide.map { it.coerceAtLeast(0) }
        val scoreResult = calculateQuickGameScore(
            currentScores = state.scores,
            pointsBySide = normalized,
            pointCap = state.pointCap
        )

        viewModelScope.launch {
            try {
                val nextRound = state.rounds + 1
                state.activeSessionId?.let { sessionId ->
                    quickGameRepository.addRound(sessionId, normalized, scoreResult.nextScores, nextRound)
                }
                _uiState.value = _uiState.value.copy(
                    quickGame = state.copy(
                        scores = scoreResult.nextScores,
                        winnerIndex = scoreResult.winnerIndex,
                        tieBreakerRequired = scoreResult.tieBreakerRequired,
                        rounds = nextRound
                    ),
                    errorCode = null,
                    statusMessage = when {
                        scoreResult.winnerIndex != null -> "برنده مشخص شد."
                        scoreResult.tieBreakerRequired -> "بازی برابر است؛ تا تعیین برنده ادامه دهید."
                        else -> null
                    }
                )
            } catch (error: Exception) {
                _uiState.value = _uiState.value.copy(
                    errorCode = error.message ?: "QUICK_GAME_ROUND_FAILED",
                    statusMessage = "ثبت دور انجام نشد."
                )
            }
        }
    }

    fun resetQuickGame() {
        val sessionId = _uiState.value.quickGame.activeSessionId
        viewModelScope.launch {
            sessionId?.let { quickGameRepository.resetSession(it) }
            _uiState.value = _uiState.value.copy(
                activeQuickGame = null,
                quickGame = QuickGameUiState(),
                errorCode = null,
                statusMessage = null
            )
        }
    }

    fun updateProfile(name: String, username: String, email: String) {
        if (name.isBlank() || username.isBlank() || email.isBlank()) {
            _uiState.value = _uiState.value.copy(
                errorCode = "PROFILE_INPUT_REQUIRED",
                statusMessage = "نام، نام کاربری و ایمیل لازم هستند."
            )
            return
        }
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(busy = true, errorCode = null, statusMessage = null)
            try {
                val user = authRepository.updateProfile(
                    ProfileUpdate(
                        name = name.trim(),
                        username = username.trim(),
                        email = email.trim()
                    )
                )
                val current = _uiState.value.session
                _uiState.value = _uiState.value.copy(
                    session = current?.copy(user = user),
                    busy = false,
                    errorCode = null,
                    statusMessage = "پروفایل به‌روز شد."
                )
            } catch (error: Exception) {
                _uiState.value = _uiState.value.copy(
                    busy = false,
                    errorCode = error.message ?: "PROFILE_UPDATE_FAILED",
                    statusMessage = "به‌روزرسانی پروفایل انجام نشد."
                )
            }
        }
    }

    fun changePassword(currentPassword: String, newPassword: String) {
        if (currentPassword.isBlank() || newPassword.isBlank()) {
            _uiState.value = _uiState.value.copy(
                errorCode = "PASSWORD_INPUT_REQUIRED",
                statusMessage = "رمز فعلی و رمز جدید لازم هستند."
            )
            return
        }
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(busy = true, errorCode = null, statusMessage = null)
            try {
                authRepository.changePassword(
                    PasswordChange(
                        currentPassword = currentPassword,
                        newPassword = newPassword
                    )
                )
                _uiState.value = _uiState.value.copy(
                    busy = false,
                    errorCode = null,
                    statusMessage = "رمز عبور تغییر کرد."
                )
            } catch (error: Exception) {
                _uiState.value = _uiState.value.copy(
                    busy = false,
                    errorCode = error.message ?: "PASSWORD_CHANGE_FAILED",
                    statusMessage = "تغییر رمز عبور انجام نشد."
                )
            }
        }
    }

    fun setTheme(value: String) {
        viewModelScope.launch {
            preferences.setTheme(value)
            _uiState.value = _uiState.value.copy(theme = value, statusMessage = "پوسته به‌روز شد.")
        }
    }

    fun setSoundEnabled(enabled: Boolean) {
        viewModelScope.launch {
            preferences.setSoundEnabled(enabled)
            _uiState.value = _uiState.value.copy(soundEnabled = enabled)
        }
    }

    fun setHapticsEnabled(enabled: Boolean) {
        viewModelScope.launch {
            preferences.setHapticsEnabled(enabled)
            _uiState.value = _uiState.value.copy(hapticsEnabled = enabled)
        }
    }

    fun setNotificationsEnabled(enabled: Boolean) {
        viewModelScope.launch {
            preferences.setNotificationsEnabled(enabled)
            _uiState.value = _uiState.value.copy(
                notificationsEnabled = enabled,
                statusMessage = if (enabled) "اعلان‌ها فعال شد." else "اعلان‌ها غیرفعال شد."
            )
        }
    }

    fun reportExternalError(code: String, message: String) {
        _uiState.value = _uiState.value.copy(errorCode = code, statusMessage = message, busy = false)
    }

    fun reportExternalInfo(message: String) {
        _uiState.value = _uiState.value.copy(errorCode = null, statusMessage = message)
    }

    fun refreshPasskeys() {
        viewModelScope.launch {
            try {
                val passkeys = authRepository.listPasskeys()
                _uiState.value = _uiState.value.copy(
                    passkeys = passkeys,
                    errorCode = null,
                    statusMessage = "لیست پاس‌کی‌ها به‌روز شد."
                )
            } catch (error: Exception) {
                _uiState.value = _uiState.value.copy(
                    errorCode = error.message ?: "PASSKEY_LIST_FAILED",
                    statusMessage = "دریافت لیست پاس‌کی‌ها انجام نشد."
                )
            }
        }
    }

    fun removePasskey(passkeyId: String) {
        if (passkeyId.isBlank()) return
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(busy = true)
            try {
                authRepository.removePasskey(passkeyId)
                val updated = authRepository.listPasskeys()
                _uiState.value = _uiState.value.copy(
                    passkeys = updated,
                    busy = false,
                    errorCode = null,
                    statusMessage = "پاس‌کی حذف شد."
                )
            } catch (error: Exception) {
                _uiState.value = _uiState.value.copy(
                    busy = false,
                    errorCode = error.message ?: "PASSKEY_REMOVE_FAILED",
                    statusMessage = "حذف پاس‌کی انجام نشد."
                )
            }
        }
    }
}

class AppViewModelFactory(
    private val authRepository: AuthRepository,
    private val quickGameRepository: QuickGameRepository,
    private val preferences: AppPreferences,
    private val biometricAvailableProvider: () -> Boolean,
    private val passkeyAvailableProvider: () -> Boolean
) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(AppViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return AppViewModel(
                authRepository = authRepository,
                quickGameRepository = quickGameRepository,
                preferences = preferences,
                biometricAvailableProvider = biometricAvailableProvider,
                passkeyAvailableProvider = passkeyAvailableProvider
            ) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class: ${modelClass.name}")
    }
}
