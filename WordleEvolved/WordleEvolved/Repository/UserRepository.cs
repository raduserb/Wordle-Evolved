using Microsoft.EntityFrameworkCore;
using WordleEvolved.Data;
using WordleEvolved.Interfaces;
using WordleEvolved.Models;

namespace WordleEvolved.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;
        public UserRepository(DataContext context)
        {
            _context = context;
        }

        public User GetUser(int id)
        {
            return _context.Users.Where(p => p.UserId == id).FirstOrDefault();
        }

        public User GetUser(string username)
        {
            return _context.Users.Where(p => p.UserName == username).FirstOrDefault();
        }

        public ICollection<User> GetUsers()
        {
            return _context.Users.OrderBy(p => p.UserId).ToList();
        }

        public bool UserExists(int id)
        {
            return _context.Users.Any(p => p.UserId == id);
        }

        public ICollection<GameSession> GetGameSessionsByUserId(int userId)
        {
            return _context.Users
                           .Where(u => u.UserId == userId)
                           .SelectMany(u => u.GameSessions)
                           .ToList();
        }

        public bool CreateUser(User user)
        {
            // Create a new UserStatistics for the user
            var userStatistics = new UserStatistics();
            _context.UsersStatistics.Add(userStatistics);

            // Assign the new UserStatistics to the user
            user.UserStatistics = userStatistics;

            _context.Users.Add(user);
            return Save();
        }

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0 ? true : false;
        }

        public bool UpdateUser(User user)
        {
            _context.Update(user);
            return Save();
        }

        public void DeleteUserStatisticsByUserId(int userId)
        {
            var user = _context.Users.Include(u => u.UserStatistics).FirstOrDefault(u => u.UserId == userId);
            if (user != null && user.UserStatistics != null)
            {
                _context.UsersStatistics.Remove(user.UserStatistics);
                _context.SaveChanges();
            }
        }

        public void DeleteGameSessionsByUserId(int userId)
        {
            var gameSessions = _context.GameSessions.Where(gs => gs.User.UserId == userId);
            _context.GameSessions.RemoveRange(gameSessions);
            _context.SaveChanges();
        }

        public bool DeleteUser(int userId)
        {
            var user = _context.Users.SingleOrDefault(u => u.UserId == userId);
            if (user == null)
            {
                return false;
            }

            _context.Users.Remove(user);
            return Save();
        }

        public int GetNextUserId()
        {
            // Find the highest UserId currently in the database
            var maxUserId = _context.Users.Max(u => u.UserId);

            // Return one higher than the current maximum
            return maxUserId + 1;
        }
    }
}