namespace WordleEvolved.Models
{
    public class Achievement
    {
        public int AchievementId { get; set; }
        public string AchievementName { get; set; }
        public string AchievementDescription { get; set; }
        public ICollection<UserStatisticsAchievement> UserStatistsicsAchievements { get; set; }
    }
}
