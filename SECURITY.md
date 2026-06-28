# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

Please report security vulnerabilities to moroshani@example.com.

Do not open public issues for security vulnerabilities.

## Security Best Practices

- Never commit secrets or keys to the repository
- Use environment variables for sensitive configuration
- The `.env`, `.env.local` files are excluded from commits
- Android release signing keys must be stored securely outside the repository

## Security Features

- JWT-based authentication with secure token storage
- Passkey/WebAuthn support for passwordless auth
- Biometric authentication for Android app
- Rate limiting on authentication endpoints
- Input validation and sanitization