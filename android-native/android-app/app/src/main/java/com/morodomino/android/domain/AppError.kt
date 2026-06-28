package com.morodomino.android.domain

sealed class AppError(message: String) : Exception(message) {
    class Network(message: String = "NETWORK_ERROR") : AppError(message)
    class Unauthorized(message: String = "UNAUTHORIZED") : AppError(message)
    class Conflict(message: String = "CONFLICT") : AppError(message)
    class Validation(message: String = "VALIDATION") : AppError(message)
    class Unknown(message: String = "UNKNOWN") : AppError(message)
}
