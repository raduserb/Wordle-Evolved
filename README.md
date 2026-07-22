# Wordle Evolved

A full-stack Wordle-inspired application with a .NET 6 Web API backend, React frontend, JWT authentication, database persistence, achievement tracking, and a Python-based hint engine.

## Repository structure

- `WordleEvolved/WordleEvolved/` - ASP.NET Core Web API backend project.
- `WordleEvolved/WordleEvolved_fe3/fe/wordle_evolved_fe/` - React frontend application.
- `WordleEvolved/WordleEvolved/Script/script.py` - Python hint-generator script executed by the backend.
- `WordleEvolved/WordleEvolved/wordle-bank.txt` - English word bank.
- `WordleEvolved/WordleEvolved/wordle-bank-ro.txt` - Romanian word bank used by the seeding process.
- `WordleEvolved/Hint_API/` - separate Python hint engine prototype and utilities.

## Key features

- User registration and login with JWT-based authentication.
- Persistent SQL Server storage for users, words, game sessions, achievements, and statistics.
- Achievement and statistics tracking tied to user performance.
- Word management API for create/read/update/delete operations.
- Game session API for session creation, result reporting, and history retrieval.
- Admin and premium user role management via API endpoints.
- Hint support via a Python script executed from the backend.
- Swagger/OpenAPI documentation for backend API exploration.
- React UI with login/signup, gameplay, training mode, achievements, statistics, and admin pages.

## Backend overview

### Tech stack

- ASP.NET Core Web API (.NET 6)
- Entity Framework Core with SQL Server
- ASP.NET Core Identity
- JWT Bearer authentication
- AutoMapper
- Swagger via Swashbuckle

### Important backend files

- `Program.cs` - application setup, CORS policy, authentication, DI registration, Swagger, database provider.
- `appsettings.json` - SQL Server connection string, JWT settings, logging.
- `Data/DataContext.cs` - EF Core DbContext and entity relationship configuration.
- `Controllers/` - REST controllers for authentication, users, game sessions, words, achievements, statistics, and hints.
- `Repository/` - repository implementations and interfaces for data access.
- `Models/` - domain entities such as `User`, `Word`, `GameSession`, `Achievement`, `UserStatistics`, and `UserStatisticsAchievement`.
- `Dto/` - DTO classes used for API request/response payloads.
- `Seed.cs` - seed logic to populate the database with word data and optionally sample users/game sessions.

### Backend architecture

- Repository pattern is used for data access via `IUserRepository`, `IWordRepository`, `IGameSessionRepository`, `IUserStatisticsRepository`, `IAchievementRepository`, and `IUserStatisticsAchievementRepository`.
- The database includes the following entities:
  - `User` - identity user, role, email, password, statistics, game sessions.
  - `Word` - word value and language ID.
  - `GameSession` - user session state, language, number of guesses, result, selected word.
  - `Achievement` - achievement metadata.
  - `UserStatistics` - aggregated games played, wins, losses.
  - `UserStatisticsAchievement` - join entity for user statistics and their achievements.
- `UserStatisticsAchievement` is configured with a composite key of `StatisticId` and `AchievementId`.

### Authentication

The backend uses ASP.NET Core Identity with JWT bearer authentication.

JWT settings are configured in `appsettings.json`:

```json
"JwtConfig": {
  "Issuer": "api.wordle-evolved.com",
  "Audience": "wordle-evolved-users",
  "Key": "scoalacamaltfelcalgagagagagdanmariusdan",
  "ExpiryInDays": "1"
}
```

The authentication controller exposes:

- `POST /api/Authentication/register`
- `POST /api/Authentication/login`
- `POST /api/Authentication/forgotpassword`
- `POST /api/Authentication/update`

> Note: The current implementation stores a plain `Password` field on the `User` entity while also using Identity. This is not secure for production.

### Hint engine

- `HintController` executes the Python script at `WordleEvolved/WordleEvolved/Script/script.py` by spawning `python`.
- The current script returns a random value from a small list. Python must be installed and available on `PATH`.

### Database seeding

- `Seed.cs` loads words from `wordle-bank-ro.txt` and saves them with `LanguageId = 2`.
- If run with `dotnet run -- seeddata`, the app executes the seed logic before starting.
- The seed class includes commented sample data for users, words, and game sessions.

### Notable implementation details

- Global CORS policy `AllowAll` permits any origin, method, and header.
- Swagger is enabled in development via `app.UseSwagger()` and `app.UseSwaggerUI()`.
- The backend uses `UseHttpsRedirection()`, `UseAuthentication()`, and `UseAuthorization()`.
- Some controllers have commented-out `[Authorize]` attributes, meaning current endpoints may be publicly accessible unless additional middleware is configured.

## API endpoints

### Authentication

- `POST /api/Authentication/register`
- `POST /api/Authentication/login`
- `POST /api/Authentication/forgotpassword`
- `POST /api/Authentication/update`

### User management

- `GET /api/User`
- `GET /api/User/{userId}`
- `GET /api/User/username/{username}`
- `GET /api/User/{userId}/gamesessions`
- `DELETE /api/User/{userId}`
- `PUT /api/User/{userId}/makeadmin`
- `PUT /api/User/{userId}/removeadmin`
- `PUT /api/User/{userId}/makeUserPlus`

### Word management

- `GET /api/Word`
- `GET /api/Word/{wordId}`
- `GET /api/Word/word/{wordValue}`
- `GET /api/Word/word/{wordValue}/{languageId}`
- `GET /api/Word/random/{languageId}`
- `POST /api/Word`
- `PUT /api/Word/{wordId}`
- `DELETE /api/Word/{wordId}`

### Game sessions

- `GET /api/GameSession`
- `GET /api/GameSession/{gameSessionId}`
- `GET /api/GameSession/{gameSessionId}/word`
- `GET /api/GameSession/user/{userId}`
- `POST /api/GameSession/{userId}/{languageId}`
- `POST /api/GameSession/{userId}/{wordId}/{languageId}/{nrGuesses}/{result}`
- `PUT /api/GameSession/{gameSessionId}`
- `DELETE /api/GameSession/{gameSessionId}`

### User statistics

- `GET /api/UserStatistics`
- `GET /api/UserStatistics/{statisticId}`
- `GET /api/UserStatistics/user/{userId}`
- `PUT /api/UserStatistics/{userStatisticsId}`
- `PUT /api/UserStatistics/increment/{userStatisticsId}`
- `DELETE /api/UserStatistics/{userStatisticsId}`

### Achievements

- `GET /api/Achievement`
- `GET /api/Achievement/{achievementId}`
- `GET /api/Achievement/name/{achievementName}`
- `GET /api/Achievement/user/{userId}`
- `POST /api/Achievement`
- `PUT /api/Achievement/{achievementId}`
- `DELETE /api/Achievement/{achievementId}`

### Achievement ownership

- `POST /api/UserStatisticsAchievement`
- `GET /api/UserStatisticsAchievement/achievement-ownership-rates`

### Hint API

- `GET /api/Hint`

## Frontend overview

### Tech stack

- React 18
- Create React App
- React Router DOM
- Axios
- JWT handling via `react-jwt`
- UI libraries: MUI, Semantic UI, Flowbite, styled-components
- Additional libraries: `react-icons`, `react-modal`, `react-spinners`, `jwt-decode`

### App routes

Defined in `src/App.js`:

- `/` - login/signup
- `/welcome` - welcome/dashboard
- `/play` - game play
- `/achievements` - achievement list
- `/statistics` - user statistics
- `/admin` - admin panel
- `/training` - training mode
- `/gameover` - game over flow

### Frontend location

- React app folder: `WordleEvolved_fe3/fe/wordle_evolved_fe/`

### Frontend scripts

- `npm start` - development server
- `npm run build` - production build
- `npm test` - test runner

## Setup and run

### Backend

1. Open `WordleEvolved/WordleEvolved/WordleEvolved.sln` in Visual Studio or use a terminal.
2. Update `WordleEvolved/WordleEvolved/appsettings.json` with your SQL Server connection string and JWT settings.
3. Restore NuGet packages:

```bash
cd WordleEvolved/WordleEvolved
dotnet restore
```

4. Apply EF Core migrations and create the database:

```bash
dotnet ef database update
```

5. Optional seed data run:

```bash
dotnet run -- seeddata
```

6. Run the backend:

```bash
dotnet run
```

7. Open Swagger when running in development mode.

### Frontend

1. Open `WordleEvolved_fe3/fe/wordle_evolved_fe`
2. Install dependencies:

```bash
npm install
```

3. Run the frontend:

```bash
npm start
```

4. Open the app in a browser at `http://localhost:3000`.

## Requirements

- .NET 6 SDK
- Node.js and npm
- SQL Server or compatible SQL instance
- Python installed and available as `python`

## Important notes

- The backend currently enables permissive CORS for local development.
- The backend stores a plain `Password` property on `User` while also using Identity. This should be hardened before production.
- The hint endpoint depends on `python Script/script.py` and currently returns a random value.
- Frontend API calls may point to `https://localhost:7020` by default; adjust the base URL if the backend is hosted elsewhere.
- Admin and role-based endpoints are available, but authorization is not strictly enforced on all controllers.

## Suggested improvements

- Use environment variables or a secret store for JWT configuration and database credentials.
- Enforce authorization policies on protected controllers and protect sensitive endpoints.
- Add email delivery for `forgotpassword` and secure password reset flows.
- Harden user role handling and adopt Identity roles instead of manual string roles.
- Expand the hint engine logic and align frontend hint behavior with backend output.

---

Enjoy building and extending Wordle Evolved!
