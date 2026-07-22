using WordleEvolved.Models;

namespace WordleEvolved.Interfaces
{
    public interface IAchievementRepository
    {
        public ICollection<Achievement> GetAchievements();

        Achievement GetAchievement(int id);

        Achievement GetAchievement(string achievementName);

        bool AchievementExists(int id);

        bool CreateAchivement(Achievement achivement);
        bool UpdateAchievement(Achievement achievement);
        bool DeleteAchievement(int id);
        bool Save();

    }
}