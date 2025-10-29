# Domino Scorer - Backend Documentation (v2)

## 1. Introduction

This document specifies the backend API required for the Domino Scorer web application. It is designed to support a full-fledged user authentication system using JSON Web Tokens (JWT) for standard email/password registration and login, as well as Google OAuth2 for social sign-in.

The previous frontend-only `localStorage` system has been deprecated. All user-specific data (players, game history) will be tied to a user account in a persistent database.

## 2. Authentication Strategy

### 2.1. JWT (Email/Password)

1.  **Registration**: A user signs up with a name, email, and password. The password must be securely hashed (e.g., using bcrypt) before being stored.
2.  **Login**: A user logs in with their email and password. Upon successful validation, the server generates a JWT containing the user's ID (`sub` claim).
3.  **Session**: The frontend stores this JWT (e.g., in an HttpOnly cookie or secure storage) and sends it in the `Authorization: Bearer <token>` header for all authenticated requests.
4.  **Token Validation**: The backend must validate this token on every protected endpoint.

### 2.2. Google OAuth2

1.  **Initiation**: The frontend directs the user to Google's consent screen.
2.  **Callback**: After the user grants permission, Google redirects back to a specified backend callback URL (`/api/auth/google/callback`) with an authorization code.
3.  **Token Exchange**: The backend exchanges this code with Google for an access token and a profile information token.
4.  **User Provisioning**: The backend uses the user's Google profile information (email, name) to find an existing user or create a new one in the database.
5.  **Session Creation**: The backend then generates its own JWT for the user and sends it back to the frontend, standardizing the session management.

## 3. Database Schema

A relational database (like PostgreSQL or MySQL) is recommended.

### `users`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY` | Unique identifier for the user. |
| `name` | `VARCHAR(255)`| `NOT NULL` | The user's full name. |
| `email` | `VARCHAR(255)`| `UNIQUE`, `NOT NULL` | The user's email address. |
| `password_hash`| `VARCHAR(255)`| `NULLABLE` | Hashed password (null for Google-only users). |
| `google_id` | `VARCHAR(255)`| `UNIQUE`, `NULLABLE` | The unique ID from the user's Google profile. |
| `created_at` | `TIMESTAMP` | `DEFAULT NOW()` | Timestamp of creation. |

### `players` & `game_nights`

These schemas remain the same as the previous documentation, but the `user_id` column now references the new `users` table ID.

## 4. API Endpoints

All endpoints should be prefixed with `/api`.

---

### 4.1. Auth

#### `POST /auth/register`
- **Description**: Creates a new user account with email and password.
- **Request Body**: `{ "name": "John Doe", "email": "john@example.com", "password": "strongpassword123" }`
- **Success Response (201 Created)**: Returns the user object and a JWT.
  ```json
  {
    "user": { "id": "uuid", "name": "John Doe", "email": "john@example.com" },
    "token": "your.jwt.here"
  }
  ```
- **Error**: `409 Conflict` if email is already in use.

#### `POST /auth/login`
- **Description**: Authenticates a user with email and password.
- **Request Body**: `{ "email": "john@example.com", "password": "strongpassword123" }`
- **Success Response (200 OK)**: Returns the user object and a JWT.
- **Error**: `401 Unauthorized` for invalid credentials.

#### `GET /auth/google`
- **Description**: Redirects the user to the Google OAuth consent screen.

#### `GET /auth/google/callback`
- **Description**: The callback URL Google redirects to. Handles the token exchange, user lookup/creation, and finally redirects the user back to the frontend with a session established (e.g., by setting a cookie or passing the token in a query parameter for the frontend to capture).

#### `GET /auth/me`
- **Description**: Retrieves the profile of the currently authenticated user. Used for session validation on app load.
- **Authentication**: JWT Required.
- **Success Response (200 OK)**:
  ```json
  {
    "user": { "id": "uuid", "name": "John Doe", "email": "john@example.com" }
  }
  ```

---

### 4.2. Users

#### `DELETE /users/me`
- **Description**: Deletes the authenticated user and all their associated data (players, history).
- **Authentication**: JWT Required.
- **Success Response (204 No Content)**.

---

### 4.3. Players & Game History

The endpoints for `players` and `history` remain the same as the previous documentation. They are protected routes and require a valid JWT. The backend will use the `user_id` from the JWT to ensure data is fetched and modified for the correct user.

- `GET /players`
- `POST /players`
- `PUT /players/:id`
- `DELETE /players/:id`
- `GET /history`
- `POST /history`
- `DELETE /history`
