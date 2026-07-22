using Microsoft.EntityFrameworkCore;
using WordleEvolved.Data;
using WordleEvolved.Interfaces;
using WordleEvolved.Models;

namespace WordleEvolved.Repository
{
    public class AchievementRepository : IAchievementRepository
    {
        private readonly DataContext _context;
        public AchievementRepository(DataContext context)
        {
            _context = context;
        }
        public bool AchievementExists(int id)
        {
            return _context.Achievements.Any(p => p.AchievementId == id);
        }

        public bool CreateAchivement(Achievement achivement)
        {
            _context.Add(achivement);

            return Save();
        }

        public bool DeleteAchievement(int id)
        {
            var achievement = _context.Achievements.Find(id);
            if (achievement == null)
            {
                return false;
            }

            _context.Achievements.Remove(achievement);
            return Save();
        }

        public Achievement GetAchievement(int id)
        {
            return _context.Achievements.Where(p => p.AchievementId == id).FirstOrDefault();
        }

        public Achievement GetAchievement(string achievementName)
        {
            return _context.Achievements.Where(p => p.AchievementName == achievementName).FirstOrDefault();
        }

        public ICollection<Achievement> GetAchievements()
        {
            return _context.Achievements.OrderBy(p => p.AchievementId).ToList();
        }

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0 ? true : false;
        }

        public bool UpdateAchievement(Achievement achievement)
        {
            _context.Update(achievement);
            return Save();
        }
    }
}