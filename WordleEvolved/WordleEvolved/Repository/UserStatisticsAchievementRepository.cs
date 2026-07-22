using WordleEvolved.Data;
using WordleEvolved.Models;
using System.Linq;
using WordleEvolved.Interfaces;

namespace WordleEvolved.Repository
{
    public class UserStatisticsAchievementRepository : IUserStatisticsAchievementRepository
    {
        private readonly DataContext _context;

        public UserStatisticsAchievementRepository(DataContext context)
        {
            _context = context;
        }

        public bool AddAchievementToUserStatistics(int statisticId, int achievementId)
        {
            // First, check if the UserStatistics and Achievement exist
            if (!_context.UsersStatistics.Any(us => us.StatisticId == statisticId) ||
                !_context.Achievements.Any(a => a.AchievementId == achievementId))
                return false;

            // Then, create a new UserStatistsicsAchievement
            var userStatistsicsAchievement = new UserStatisticsAchievement
            {
                StatisticId = statisticId,
                AchievementId = achievementId
            };

            // Add it to the database context
            _context.UserStatistsicsAchievements.Add(userStatistsicsAchievement);

            // Save changes
            return _context.SaveChanges() > 0;
        }

        public int GetTotalUsers()
        {
            return _context.Users.Count();
        }

        public Dictionary<string, double> GetAchievementOwnershipRates()
        {
            var totalUsers = _context.Users.Count();
            var achievements = _context.Achievements.ToList(); // Force immediate query execution
            var achievementOwnershipRates = new Dictionary<string, double>();

            foreach (var achievement in achievements)
            {
                var usersWithAchievement = _context.UserStatistsicsAchievements
                    .Count(usa => usa.AchievementId == achievement.AchievementId);
                var ownershipRate = (double)usersWithAchievement / totalUsers * 100;

                achievementOwnershipRates.Add(achievement.AchievementName, ownershipRate);
            }

            return achievementOwnershipRates;
        }


    }
}