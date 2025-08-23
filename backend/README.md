# 🧾 Keepr Backend

Keepr is a NestJS based API for storing personal documents such as receipts, warranties and contracts. The service exposes a REST interface secured with JWT authentication and supports Google OAuth for a smooth sign‑in experience.

## Features

- **NestJS** server with PostgreSQL database via TypeORM
- DTO input validation using `class-validator`
- JWT authentication with optional blacklist on logout
- Google OAuth 2.0 login flow
- Basic user and item CRUD endpoints
- Global exception handling and structured success responses

## Technologies

- [NestJS](https://nestjs.com/)
- [TypeORM](https://typeorm.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Passport](https://www.passportjs.org/)
- [Google OAuth 2.0](https://developers.google.com/identity)
- [JWT](https://jwt.io/)

## Getting Started

### Prerequisites

- Node.js >= 18
- PostgreSQL >= 12
- npm or yarn

### Installation

```bash
# clone the repo
git clone https://github.com/your-username/keepr-backend.git
cd keepr-backend

@@ -41,67 +42,84 @@ npm install
Create a `.env` file in the project root and define the following variables:

```bash
# database configuration
DB_URL=postgres://postgres:admin@localhost:5432/postgres
DB_SSL=false

# authentication
JWT_ACCESS_TOKEN_SECRET=your-jwt-secret
BCRYPT_SALT_ROUNDS=10

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
```

Start the development server:

```bash
npm run start:dev
```

The API listens on `http://localhost:3000` by default.

## Security considerations

All database access is performed through TypeORM repositories which use parameterised SQL queries. Input to every endpoint is validated using DTO classes and `class-validator` ensuring strings are trimmed and of the correct shape. Together these mechanisms help prevent SQL injection attacks against the PostgreSQL database.

## Authentication Endpoints

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `POST` | `/auth/register` | Register a new user with email and password |
| `POST` | `/auth/login` | Obtain a JWT token |
| `POST` | `/auth/logout` | Invalidate the current JWT token |
| `GET`  | `/auth/google/login` | Redirect to Google for authentication |
| `GET`  | `/auth/google/callback` | Google OAuth callback |

## Example User Endpoints

These routes require a valid JWT in the `Authorization` header:

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `GET`  | `/users` | List all users |
| `GET`  | `/users/:id` | Get a user by id |
| `PATCH` | `/users/:id` | Update a user |
| `DELETE` | `/users/:id` | Delete a user |

## Project Structure

```
src/
├── auth/           # authentication modules
├── modules/        # domain modules (users, items)
├── common/         # shared utilities
└── main.ts         # application entry point
```

## Testing

Run the unit test suite with:

```bash
npm test
```

End‑to‑end tests can be executed with:

```bash
npm run test:e2e
```

## Potential future features

- File uploads for storing receipts and other documents
- Subscription management and billing
- User notifications (email or in‑app)
- Admin dashboard and analytics

## License

MIT © Your Name or Company