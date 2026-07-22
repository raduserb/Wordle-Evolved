using WordleEvolved.Data;
using WordleEvolved.Interfaces;
using WordleEvolved.Models;

namespace WordleEvolved.Repository
{
    public class GameSessionRepository : IGameSessionRepository
    {
        private readonly DataContext _context;
        public GameSessionRepository(DataContext context)
        {
            _context = context;
        }

        public bool CreateGameSession(GameSession gameSession)
        {
            _context.Add(gameSession);
            return Save();
        }

        public bool DeleteGameSession(int id)
        {
            var gameSession = _context.GameSessions.Find(id);
            if (gameSession == null)
            {
                return false;
            }

            _context.GameSessions.Remove(gameSession);
            return Save();
        }

        public bool GameSessionExists(int id)
        {
            return _context.GameSessions.Any(p => p.GameSessionId == id);
        }

        public GameSession GetGameSession(int id)
        {
            return _context.GameSessions.Where(p => p.GameSessionId == id).FirstOrDefault();
        }

        public ICollection<GameSession> GetGameSessions()
        {
            return _context.GameSessions.OrderBy(p => p.GameSessionId).ToList();
        }

        public Word GetWordByGameSessionId(int gameSessionId)
        {
            return _context.GameSessions
                           .Where(gs => gs.GameSessionId == gameSessionId)
                           .Select(gs => gs.Word)
                           .FirstOrDefault();
        }

        public ICollection<GameSession> GetGameSessionsByUserId(int userId)
        {
            return _context.GameSessions
                           .Where(gs => gs.User.UserId == userId)
                           .ToList();
        }


        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0 ? true : false;
        }

        public bool UpdateGameSession(GameSession gameSession)
        {
            _context.Update(gameSession);
            return Save();
        }
    }
}