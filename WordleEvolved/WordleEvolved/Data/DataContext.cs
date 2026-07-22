using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using WordleEvolved.Models;

namespace WordleEvolved.Data
{
    public class DataContext: DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) 
        {

        }
        public DbSet<Word> Words { get; set; }
        public DbSet<Achievement> Achievements { get; set; }
        public DbSet<GameSession> GameSessions { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<UserStatistics> UsersStatistics { get; set; }
        public DbSet<UserStatisticsAchievement> UserStatistsicsAchievements { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);  // This line is necessary

            modelBuilder.Entity<UserStatistics>()
                .HasKey(us => us.StatisticId);

            modelBuilder.Entity<UserStatisticsAchievement>()
                .HasKey(sa => new { sa.StatisticId, sa.AchievementId });

            modelBuilder.Entity<UserStatisticsAchievement>()
                .HasOne(s => s.UserStatistics)
                .WithMany(sa => sa.UserStatistsicsAchievements)
                .HasForeignKey(s => s.StatisticId);

            modelBuilder.Entity<UserStatisticsAchievement>()
                .HasOne(a => a.Achievement)
                .WithMany(sa => sa.UserStatistsicsAchievements)
                .HasForeignKey(a => a.AchievementId);
        }
    }
}
