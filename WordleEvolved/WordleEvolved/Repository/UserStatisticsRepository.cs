using WordleEvolved.Data;
using WordleEvolved.Interfaces;
using WordleEvolved.Models;

namespace WordleEvolved.Repository
{
    public class UserStatisticsRepository : IUserStatisticsRepository
    {
        private DataContext _context;

        public UserStatisticsRepository(DataContext context)
        {
            _context = context;
        }

        public ICollection<UserStatistics> GetAllUserStatistics()
        {
            return _context.UsersStatistics.ToList();
        }

        public UserStatistics GetUserStatistics(int statisticId)
        {
            return _context.UsersStatistics.Where(p => p.StatisticId == statisticId).FirstOrDefault();
        }

        public bool UserStatisticsExist(int id)
        {
            return _context.UsersStatistics.Any(us => us.StatisticId == id);
        }

        public UserStatistics GetUserStatisticsByUserId(int userId)
        {
            return _context.Users.Where(u => u.UserId == userId)
                                 .Select(u => u.UserStatistics)
                                 .FirstOrDefault();
        }

        public ICollection<Achievement> GetAchievementsByUserId(int userId)
        {
            return _context.Users
                           .Where(u => u.UserId == userId)
                           .SelectMany(u => u.UserStatistics.UserStatistsicsAchievements)
                           .Select(usa => usa.Achievement)
                           .ToList();
        }

        public bool CreateUserStatistics(UserStatistics userStatistics)
        {
            _context.Add(userStatistics);

            return Save();
        }


        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0 ? true : false;
        }

        public bool UpdateUserStatistics(UserStatistics userStatistics)
        {
            _context.Update(userStatistics);
            return Save();
        }

        public bool DeleteUserStatistics(int id)
        {
            var userStatistics = _context.UsersStatistics.Find(id);
            if (userStatistics == null)
            {
                return false;
            }

            _context.UsersStatistics.Remove(userStatistics);
            return Save();
        }

    }
}