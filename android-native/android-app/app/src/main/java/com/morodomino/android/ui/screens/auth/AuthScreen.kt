package com.morodomino.android.ui.screens.auth

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusDirection
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import com.morodomino.android.ui.AppUiState
import com.morodomino.android.ui.components.DominoMessagePanel
import com.morodomino.android.ui.components.DominoPanel
import com.morodomino.android.ui.components.DominoPrimaryButton
import com.morodomino.android.ui.components.DominoSecondaryButton
import com.morodomino.android.ui.components.DominoTextField

private enum class AuthRoute {
    Login,
    Register
}

@Composable
fun AuthScreen(
    state: AppUiState,
    onLogin: (String, String) -> Unit,
    onRegister: (String, String, String, String) -> Unit,
    onLoginWithBiometric: () -> Unit,
    onLoginWithPasskey: (String) -> Unit,
    initialRoute: String = "login"
) {
    var route by rememberSaveable(initialRoute) { mutableStateOf(initialAuthRoute(initialRoute)) }
    var loginIdentifier by rememberSaveable { mutableStateOf("") }
    var loginPassword by rememberSaveable { mutableStateOf("") }
    var registerName by rememberSaveable { mutableStateOf("") }
    var registerUsername by rememberSaveable { mutableStateOf("") }
    var registerEmail by rememberSaveable { mutableStateOf("") }
    var registerPassword by rememberSaveable { mutableStateOf("") }

    val focusManager = LocalFocusManager.current

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .statusBarsPadding()
            .navigationBarsPadding()
            .imePadding()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 14.dp, vertical = 14.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        AuthHeader(route = route)

        state.errorCode?.let {
            DominoMessagePanel(
                title = "نیاز به بررسی",
                message = state.statusMessage ?: it,
                isError = true
            )
        } ?: state.statusMessage?.let {
            DominoMessagePanel(
                title = "وضعیت",
                message = it,
                isError = false
            )
        }

        DominoPanel {
            when (route) {
                AuthRoute.Login -> LoginForm(
                    state = state,
                    identifier = loginIdentifier,
                    password = loginPassword,
                    onIdentifierChanged = { loginIdentifier = it },
                    onPasswordChanged = { loginPassword = it },
                    onSubmit = {
                        focusManager.clearFocus()
                        onLogin(loginIdentifier, loginPassword)
                    },
                    onCreateAccount = { route = AuthRoute.Register },
                    onLoginWithBiometric = onLoginWithBiometric,
                    onLoginWithPasskey = onLoginWithPasskey
                )

                AuthRoute.Register -> RegisterForm(
                    state = state,
                    name = registerName,
                    username = registerUsername,
                    email = registerEmail,
                    password = registerPassword,
                    onNameChanged = { registerName = it },
                    onUsernameChanged = { registerUsername = it },
                    onEmailChanged = { registerEmail = it },
                    onPasswordChanged = { registerPassword = it },
                    onSubmit = {
                        focusManager.clearFocus()
                        onRegister(registerName, registerUsername, registerEmail, registerPassword)
                    },
                    onBackToLogin = { route = AuthRoute.Login }
                )
            }
        }
    }
}

private fun initialAuthRoute(value: String): AuthRoute {
    return if (value.equals("register", ignoreCase = true)) AuthRoute.Register else AuthRoute.Login
}

@Composable
private fun AuthHeader(route: AuthRoute) {
    Column(verticalArrangement = Arrangement.spacedBy(3.dp)) {
        Text(
            "دومینویار",
            style = MaterialTheme.typography.headlineMedium,
            color = MaterialTheme.colorScheme.onBackground
        )
        Text(
            if (route == AuthRoute.Login) "ورود به نسخه اندروید" else "ساخت حساب جدید",
            style = MaterialTheme.typography.titleMedium,
            color = MaterialTheme.colorScheme.primary
        )
        Text(
            "بازی امتیازشماری دومینو با ورود امن و ادامه آفلاین.",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}

@Composable
private fun LoginForm(
    state: AppUiState,
    identifier: String,
    password: String,
    onIdentifierChanged: (String) -> Unit,
    onPasswordChanged: (String) -> Unit,
    onSubmit: () -> Unit,
    onCreateAccount: () -> Unit,
    onLoginWithBiometric: () -> Unit,
    onLoginWithPasskey: (String) -> Unit
) {
    val focusManager = LocalFocusManager.current

    Text("ورود", style = MaterialTheme.typography.titleLarge)
    Text(
        "ایمیل یا نام کاربری را وارد کنید.",
        style = MaterialTheme.typography.bodyMedium,
        color = MaterialTheme.colorScheme.onSurfaceVariant
    )
    DominoTextField(
        value = identifier,
        onValueChange = onIdentifierChanged,
        label = "ایمیل یا نام کاربری",
        keyboardOptions = KeyboardOptions(
            keyboardType = KeyboardType.Email,
            imeAction = ImeAction.Next
        ),
        keyboardActions = KeyboardActions(onNext = { focusManager.moveFocus(FocusDirection.Down) })
    )
    DominoTextField(
        value = password,
        onValueChange = onPasswordChanged,
        label = "رمز عبور",
        visualTransformation = PasswordVisualTransformation(),
        keyboardOptions = KeyboardOptions(
            keyboardType = KeyboardType.Password,
            imeAction = ImeAction.Done
        ),
        keyboardActions = KeyboardActions(onDone = { onSubmit() })
    )
    DominoPrimaryButton(
        text = "ورود",
        busyText = "در حال ورود...",
        busy = state.busy,
        onClick = onSubmit
    )
    SecondaryAuthActions(
        state = state,
        identifier = identifier,
        onLoginWithBiometric = onLoginWithBiometric,
        onLoginWithPasskey = onLoginWithPasskey
    )
    TextButton(onClick = onCreateAccount, modifier = Modifier.fillMaxWidth()) {
        Text("حساب ندارید؟ ثبت‌نام")
    }
}

@Composable
private fun RegisterForm(
    state: AppUiState,
    name: String,
    username: String,
    email: String,
    password: String,
    onNameChanged: (String) -> Unit,
    onUsernameChanged: (String) -> Unit,
    onEmailChanged: (String) -> Unit,
    onPasswordChanged: (String) -> Unit,
    onSubmit: () -> Unit,
    onBackToLogin: () -> Unit
) {
    val focusManager = LocalFocusManager.current

    Text("ثبت‌نام", style = MaterialTheme.typography.titleLarge)
    Text(
        "اطلاعات اصلی را وارد کنید تا حساب و جلسه بازی آماده شود.",
        style = MaterialTheme.typography.bodyMedium,
        color = MaterialTheme.colorScheme.onSurfaceVariant
    )
    DominoTextField(
        value = name,
        onValueChange = onNameChanged,
        label = "نام کامل",
        keyboardOptions = KeyboardOptions(imeAction = ImeAction.Next),
        keyboardActions = KeyboardActions(onNext = { focusManager.moveFocus(FocusDirection.Down) })
    )
    DominoTextField(
        value = username,
        onValueChange = onUsernameChanged,
        label = "نام کاربری",
        keyboardOptions = KeyboardOptions(imeAction = ImeAction.Next),
        keyboardActions = KeyboardActions(onNext = { focusManager.moveFocus(FocusDirection.Down) })
    )
    DominoTextField(
        value = email,
        onValueChange = onEmailChanged,
        label = "ایمیل",
        keyboardOptions = KeyboardOptions(
            keyboardType = KeyboardType.Email,
            imeAction = ImeAction.Next
        ),
        keyboardActions = KeyboardActions(onNext = { focusManager.moveFocus(FocusDirection.Down) })
    )
    DominoTextField(
        value = password,
        onValueChange = onPasswordChanged,
        label = "رمز عبور",
        visualTransformation = PasswordVisualTransformation(),
        keyboardOptions = KeyboardOptions(
            keyboardType = KeyboardType.Password,
            imeAction = ImeAction.Done
        ),
        keyboardActions = KeyboardActions(onDone = { onSubmit() })
    )
    DominoPrimaryButton(
        text = "ساخت حساب",
        busyText = "در حال ثبت‌نام...",
        busy = state.busy,
        onClick = onSubmit
    )
    TextButton(onClick = onBackToLogin, modifier = Modifier.fillMaxWidth()) {
        Text("حساب دارید؟ بازگشت به ورود")
    }
}

@Composable
private fun SecondaryAuthActions(
    state: AppUiState,
    identifier: String,
    onLoginWithBiometric: () -> Unit,
    onLoginWithPasskey: (String) -> Unit
) {
    if (!state.biometricAvailable && !state.passkeyAvailable) return

    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Text(
            "روش‌های تکمیلی",
            style = MaterialTheme.typography.labelLarge,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        if (state.passkeyAvailable) {
            DominoSecondaryButton(
                text = "ورود با پاس‌کی",
                onClick = { onLoginWithPasskey(identifier) },
                enabled = !state.busy
            )
        }
        if (state.biometricAvailable) {
            DominoSecondaryButton(
                text = "بازگشایی با بیومتریک",
                onClick = onLoginWithBiometric,
                enabled = !state.busy,
                contentColor = MaterialTheme.colorScheme.secondary
            )
        }
    }
}
