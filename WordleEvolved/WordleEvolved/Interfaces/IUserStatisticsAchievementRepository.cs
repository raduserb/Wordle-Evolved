using Microsoft.EntityFrameworkCore;

namespace WordleEvolved.Interfaces
{
    public interface IUserStatisticsAchievementRepository
    {
        bool AddAchievementToUserStatistics(int statisticId, int achievementId);

        public Dictionary<string, double> GetAchievementOwnershipRates();
    }
}
