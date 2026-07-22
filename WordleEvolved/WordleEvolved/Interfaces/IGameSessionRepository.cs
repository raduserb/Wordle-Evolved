using WordleEvolved.Models;

namespace WordleEvolved.Interfaces
{
    public interface IGameSessionRepository
    {
        public ICollection<GameSession> GetGameSessions();

        GameSession GetGameSession(int id);

        bool GameSessionExists(int id);
        Word GetWordByGameSessionId(int gameSessionId);
        bool CreateGameSession(GameSession gameSession);
        bool UpdateGameSession(GameSession gameSession);
        public ICollection<GameSession> GetGameSessionsByUserId(int userId);
        bool DeleteGameSession(int id);
        bool Save();
    }
}