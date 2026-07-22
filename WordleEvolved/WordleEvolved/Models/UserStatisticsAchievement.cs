namespace WordleEvolved.Models
{
    public class UserStatisticsAchievement
    {
        public int StatisticId { get; set; }
        public int AchievementId { get; set; }
        public UserStatistics UserStatistics { get; set; }
        public Achievement Achievement { get; set; }
    }
}
