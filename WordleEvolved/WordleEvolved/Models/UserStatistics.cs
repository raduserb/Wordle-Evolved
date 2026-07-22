namespace WordleEvolved.Models
{
    public class UserStatistics
    {
        public int StatisticId { get; set; }
        public int GamesPlayed { get; set; }
        public int Wins { get; set; }
        public int Losses { get; set; }
        public ICollection<UserStatisticsAchievement> UserStatistsicsAchievements { get; set; }
    }
}
