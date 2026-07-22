using Microsoft.AspNetCore.Mvc;
using WordleEvolved.Dto;
using WordleEvolved.Interfaces;

namespace WordleEvolved.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserStatisticsAchievementController : ControllerBase
    {
        private readonly IUserStatisticsAchievementRepository _userStatisticsAchievementRepository;

        public UserStatisticsAchievementController(IUserStatisticsAchievementRepository userStatisticsAchievementRepository)
        {
            _userStatisticsAchievementRepository = userStatisticsAchievementRepository;
        }

        [HttpPost]
        public IActionResult AddAchievementToUserStatistics([FromBody] UserStatisticsAchievementDto userStatisticsAchievementDto)
        {
            if (userStatisticsAchievementDto == null)
                return BadRequest();

            if (_userStatisticsAchievementRepository.AddAchievementToUserStatistics(userStatisticsAchievementDto.StatisticId, userStatisticsAchievementDto.AchievementId))
                return Ok();

            return StatusCode(500);
        }

        [HttpGet("achievement-ownership-rates")]
        public IActionResult GetAchievementOwnershipRates()
        {
            var achievementOwnershipRates = _userStatisticsAchievementRepository.GetAchievementOwnershipRates();
            return Ok(achievementOwnershipRates);
        }

    }
}