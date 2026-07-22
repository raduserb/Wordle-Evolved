using AutoMapper;
using WordleEvolved.Dto;
using WordleEvolved.Models;
using WordleEvolved.Repository;

namespace WordleEvolved.Helper
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<User, UserDto>();
            CreateMap<UserDto, User>();
            CreateMap<UserStatistics, UserStatisticsDto>();
            CreateMap<UserStatisticsDto, UserStatistics>();
            CreateMap<Achievement, AchievementDto>();
            CreateMap<AchievementDto, Achievement>();
            CreateMap<GameSession, GameSessionDto>();
            CreateMap<GameSessionDto, GameSession>();
            CreateMap<Word, WordDto>();
            CreateMap<WordDto, Word>();
            CreateMap<UserStatisticsAchievement, UserStatisticsAchievementDto>();
            CreateMap<UserStatisticsAchievementDto, UserStatisticsAchievement>();
        }
    }
}
