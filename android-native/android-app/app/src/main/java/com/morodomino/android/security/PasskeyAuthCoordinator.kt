package com.morodomino.android.security

import android.app.Activity
import androidx.credentials.CreatePublicKeyCredentialRequest
import androidx.credentials.CreatePublicKeyCredentialResponse
import androidx.credentials.CredentialManager
import androidx.credentials.GetCredentialRequest
import androidx.credentials.GetPublicKeyCredentialOption
import androidx.credentials.PublicKeyCredential
import com.morodomino.android.BuildConfig
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject

class PasskeyAuthCoordinator(
    private val activity: Activity
) {
    private val credentialManager = CredentialManager.create(activity)
    private val http = OkHttpClient()
    private val jsonType = "application/json; charset=utf-8".toMediaType()

    suspend fun loginWithPasskey(identifier: String): PasskeyLoginResult {
        val optionsJson = postJson(
            path = "/api/auth/passkey/login/options",
            payload = JSONObject().put("identifier", identifier)
        )

        val option = GetPublicKeyCredentialOption(optionsJson.toString())
        val request = GetCredentialRequest(listOf(option))
        val result = credentialManager.getCredential(activity, request)
        val credential = result.credential
        if (credential !is PublicKeyCredential) {
            throw IllegalStateException("PASSKEY_CREDENTIAL_NOT_RETURNED")
        }

        val verifyPayload = JSONObject()
            .put("identifier", identifier)
            .put("credential", JSONObject(credential.authenticationResponseJson))
            .put("rememberMe", true)

        val verifyJson = postJson("/api/auth/passkey/login/verify", verifyPayload)
        val token = verifyJson.optString("token")
        val userObj = verifyJson.optJSONObject("user") ?: JSONObject()

        return PasskeyLoginResult(
            token = token,
            userId = userObj.optString("id"),
            name = userObj.optString("name"),
            username = userObj.optString("username"),
            email = userObj.optString("email")
        )
    }

    suspend fun registerPasskey(authToken: String): Boolean {
        val optionsJson = postJson(
            path = "/api/auth/passkey/register/options",
            payload = JSONObject(),
            authToken = authToken
        )

        val createRequest = CreatePublicKeyCredentialRequest(optionsJson.toString())
        val result = credentialManager.createCredential(activity, createRequest)
        val credential = result as? CreatePublicKeyCredentialResponse ?: return false
        val verifyPayload = JSONObject(credential.registrationResponseJson)
        val verifyJson = postJson(
            path = "/api/auth/passkey/register/verify",
            payload = verifyPayload,
            authToken = authToken
        )
        return verifyJson.optBoolean("ok", false)
    }

    private fun postJson(path: String, payload: JSONObject, authToken: String? = null): JSONObject {
        val reqBuilder = Request.Builder()
            .url(BuildConfig.API_BASE_URL.trimEnd('/') + path)
            .post(payload.toString().toRequestBody(jsonType))
            .addHeader("Content-Type", "application/json")

        if (!authToken.isNullOrBlank()) {
            reqBuilder.addHeader("Authorization", "Bearer $authToken")
        }

        http.newCall(reqBuilder.build()).execute().use { response ->
            val bodyText = response.body?.string().orEmpty()
            if (!response.isSuccessful) {
                throw IllegalStateException("PASSKEY_HTTP_${response.code}:${bodyText.take(200)}")
            }
            return if (bodyText.isBlank()) JSONObject() else JSONObject(bodyText)
        }
    }
}

data class PasskeyLoginResult(
    val token: String,
    val userId: String,
    val name: String,
    val username: String,
    val email: String
)
