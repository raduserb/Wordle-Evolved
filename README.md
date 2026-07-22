# Wordle Evolved

Welcome to Wordle Evolved! This project is a feature-rich, full-stack web application inspired by the popular word game Wordle. It extends the classic gameplay with user accounts, persistent statistics, an achievement system, multi-language support, and an intelligent hint system.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup (.NET Core)](#backend-setup-net-core)
  - [Frontend Setup (React)](#frontend-setup-react)
  - [Hint API Setup (Python)](#hint-api-setup-python)
- [API Endpoints](#api-endpoints)
- [Hint System Algorithms](#hint-system-algorithms)

## Overview

Wordle Evolved is designed to be a more engaging and long-term version of Wordle. Players can register, track their progress over time, unlock achievements for various milestones, and play in different languages. The application is built with a modern, decoupled architecture, featuring a .NET Core backend, a React frontend, and a separate Python service for providing game hints.

## Features

*   **Classic Wordle Gameplay**: A familiar and intuitive word-guessing game interface.
*   **User Authentication**: Secure user registration and login using JWT.
*   **Persistent User Statistics**: Tracks games played, wins, and losses for each user.
*   **Achievement System**: Rewards players for milestones like their first win, winning streaks, or advanced plays.
*   **Multi-Language Support**: The database is structured to support words from multiple languages (currently seeded with English and Romanian).
*   **RESTful Backend API**: A robust API built with ASP.NET Core to manage all game data, users, and statistics.
*   **Intelligent Hint API**: A Python-based service that can suggest the next best guess using various algorithms.
*   **Role-Based User Tiers**: Users can be promoted to `user+` or `admin` roles, unlocking different privileges.

## Technology Stack

*   **Backend**: C#, ASP.NET Core, Entity Framework Core, JWT Authentication
*   **Frontend**: React.js, Axios, Material-UI
*   **Hint API**: Python 3
*   **Database**: Microsoft SQL Server

## Project Structure

The repository is organized into three main parts:

*   `WordleEvolved/`: The .NET Core backend solution.
    *   `Controllers/`: API controllers for handling HTTP requests.
    *   `Data/`: Contains the `DataContext` for Entity Framework Core.
    *   `Models/`: Defines the data models (User, Word, GameSession, etc.).
    *   `Repository/`: Implements the repository pattern for data access.
    *   `Seed.cs`: A utility to seed the database with initial data (words, etc.).
    *   `Program.cs`: Application entry point and service configuration.
*   `WordleEvolved_fe3/fe/wordle_evolved_fe/`: The React frontend application.
    *   `src/Components/`: Contains the main React components.
        *   `Play/`: The core game component, board, and keyboard.
        *   `Statistics/`: Component for displaying user stats.
*   `Hint_API/`: The Python-based hint generation service.
    *   `algorithms.py`: Implements different strategies for guessing words.
    *   `game.py`: A simulation of the Wordle game logic.

## Getting Started

### Prerequisites

*   .NET SDK
*   Node.js and npm
*   Python 3
*   SQL Server

### Backend Setup (.NET Core)

1.  **Configure Database Connection**:
    *   Open `WordleEvolved/appsettings.json`.
    *   Modify the `DefaultConnection` string to point to your SQL Server instance.

2.  **Apply Migrations and Seed Data**:
    *   Navigate to the `WordleEvolved/WordleEvolved` directory.
    *   Run the database migrations: `dotnet ef database update`
    *   Seed the database with words. The `Seed.cs` file is configured to read from `wordle-bank.txt` and `wordle-bank-ro.txt`. Place these files in the `WordleEvolved/WordleEvolved` directory.
    *   Run the seeder: `dotnet run seeddata`

3.  **Run the Backend Server**:
    *   From the `WordleEvolved/WordleEvolved` directory, run: `dotnet run`
    *   The API will be available at `https://localhost:7020`.
    *   API documentation is available via Swagger at `https://localhost:7020/swagger`.

### Frontend Setup (React)

1.  **Navigate to the frontend directory**:
    ```bash
    cd WordleEvolved_fe3/fe/wordle_evolved_fe
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Start the development server**:
    ```bash
    npm start
    ```
    The application will open in your browser at `http://localhost:3000`.

### Hint API Setup (Python)

The Hint API is designed to be run from the command line to provide a word suggestion based on the current state of a game.

1.  **Navigate to the API directory**:
    ```bash
    cd Hint_API
    ```

2.  **Install dependencies** (if any):
    ```bash
    pip install -r requirements.txt 
    # Note: A requirements.txt file may need to be created if there are dependencies like pandas.
    ```

3.  **Run the script**:
    The script can be executed with command-line arguments representing the game state. The first argument is the secret answer, and subsequent arguments are the guesses made so far.

    ```bash
    python algorithms.py <ANSWER> <GUESS_1> <GUESS_2> ...
    ```

    **Example**:
    ```bash
    python algorithms.py train stare
    ```
    This will simulate a game where the answer is "train" and the first guess was "stare", then output the next recommended guess.

## API Endpoints

The backend exposes several RESTful endpoints for managing the application's data. All are prefixed with `/api`.

*   `GET /User`: Get all users.
*   `GET /User/{userId}`: Get a specific user by ID.
*   `GET /User/{userId}/gamesessions`: Get all game sessions for a user.
*   `POST /GameSession/{userId}/{wordId}/{languageId}/{nrGuesses}/{result}`: Create a new game session.
*   `PUT /UserStatistics/increment/{statId}`: Increment win/loss count for a user.
*   `POST /UserStatisticsAchievement`: Link an achievement to a user's statistics.
*   `POST /Auth/register`: Register a new user.
*   `POST /Auth/login`: Log in a user and receive a JWT.

For a full list of endpoints and their details, please refer to the Swagger UI at `/swagger` when the backend is running.

## Hint System Algorithms

The `Hint_API` provides several algorithms for word suggestions, implemented in `algorithms.py`:

*   **HumanAlgorithm**: Mimics a human player by selecting a random word from the list of remaining possibilities.
*   **NaiveFrequencyAlgorithm**: Suggests the word containing the most common letters among the remaining possible words. This helps narrow down the possibilities by testing popular letters.
*   **MaxEntropyAlgorithm**: An advanced approach based on information theory. It calculates the "entropy" for each possible guess and selects the word that, on average, provides the most information, drastically reducing the number of remaining possibilities.

---

This README provides a comprehensive guide to understanding, setting up, and running the Wordle Evolved project. Enjoy!
