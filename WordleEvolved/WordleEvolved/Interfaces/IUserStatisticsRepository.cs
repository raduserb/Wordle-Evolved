using WordleEvolved.Models;

namespace WordleEvolved.Interfaces
{
    public interface IUserStatisticsRepository
    {
        public ICollection<UserStatistics> GetAllUserStatistics();

        UserStatistics GetUserStatistics(int statisticId);

        bool UserStatisticsExist(int id);

        UserStatistics GetUserStatisticsByUserId(int userId);

        ICollection<Achievement> GetAchievementsByUserId(int userId);

        bool CreateUserStatistics(UserStatistics userStaistics);

        bool UpdateUserStatistics(UserStatistics userStatistics);

        bool DeleteUserStatistics(int id);
        bool Save();

        //UserStatistics GetUserStatisticsByUser(int userId);
        //public ICollection<Achievement> GetUserStatisticsAchievements();
    }
}
