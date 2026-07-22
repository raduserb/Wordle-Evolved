using System.Net.WebSockets;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using WordleEvolved.Dto;
using WordleEvolved.Interfaces;
using WordleEvolved.Models;
using WordleEvolved.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace WordleEvolved.Controllers
{
    //[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Route("/api/[controller]")]
    [ApiController]
    public class AchievementController : Controller
    {
        private readonly IAchievementRepository _achievementRepository;
        private readonly IUserStatisticsRepository _userStatisticsRepository;
        private readonly IMapper _mapper;

        public AchievementController(IAchievementRepository achievementRepository, IUserStatisticsRepository userStatisticsRepository, IMapper mapper)
        {
            _achievementRepository = achievementRepository;
            _userStatisticsRepository = userStatisticsRepository;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Achievement>))]
        public IActionResult GetAchievements()
        {
            var achievements = _mapper.Map<List<AchievementDto>>(_achievementRepository.GetAchievements());

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(achievements);
        }

        [HttpGet("{achievementId}")]
        [ProducesResponseType(200, Type = typeof(Achievement))]
        [ProducesResponseType(400)]
        public IActionResult GetAchievement(int achievementId)
        {
            if (!_achievementRepository.AchievementExists(achievementId))
                return NotFound();

            var achievement = _mapper.Map<AchievementDto>(_achievementRepository.GetAchievement(achievementId));

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(achievement);
        }

        [HttpGet("name/{achievementName}")]
        [ProducesResponseType(200, Type = typeof(Achievement))]
        [ProducesResponseType(400)]
        public IActionResult GetAchievement(string achievementName)
        {

            var achievement = _mapper.Map<AchievementDto>(_achievementRepository.GetAchievement(achievementName));

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(achievement);
        }

        [HttpGet("user/{userId}")]
        //[Authorize(Roles = "admin, owner")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Achievement>))]
        [ProducesResponseType(400)]
        public IActionResult GetAchievementsByUserId(int userId)
        {
            var achievements = _mapper.Map<List<AchievementDto>>(_userStatisticsRepository.GetAchievementsByUserId(userId));

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(achievements);
        }

        [HttpPost]
        [Authorize(Roles = "admin, owner")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public IActionResult CreateAchievement([FromBody] AchievementDto achievementCreate)
        {
            if (achievementCreate == null)
                return BadRequest(ModelState);

            var achievement = _achievementRepository.GetAchievements()
                .Where(a => a.AchievementName.Trim().ToUpper() == achievementCreate.AchievementName.TrimEnd().ToUpper())
                .FirstOrDefault();

            if (achievement != null)
            {
                ModelState.AddModelError("", "Achievement already exists");
                return StatusCode(422, ModelState);
            }

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var achievementMap = _mapper.Map<Achievement>(achievementCreate);

            if (!_achievementRepository.CreateAchivement(achievementMap))
            {
                ModelState.AddModelError("", "something went wrong while saving");
                return StatusCode(500, ModelState);
            }

            return Ok("Successfully created");
        }

        [HttpPut("{achievementId}")]
        [Authorize(Roles = "admin, owner")]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public IActionResult UpdateAchievement(int achievementId, [FromBody] AchievementDto updatedAchievement)
        {
            if (updatedAchievement == null)
                return BadRequest(ModelState);

            if (achievementId != updatedAchievement.AchievementId)
                return BadRequest(ModelState);

            if (!_achievementRepository.AchievementExists(achievementId))
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest();

            var achievementMap = _mapper.Map<Achievement>(updatedAchievement);

            if (!_achievementRepository.UpdateAchievement(achievementMap))
            {
                ModelState.AddModelError("", "something went wrong");
                return StatusCode(500, ModelState);
            }

            return NoContent();
        }

        [HttpDelete("{achievementId}")]
        [Authorize(Roles = "admin, owner")]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public IActionResult DeleteAchievement(int achievementId)
        {
            if (!_achievementRepository.AchievementExists(achievementId))
                return NotFound();

            var achievementToDelete = _achievementRepository.GetAchievement(achievementId);
            if (achievementToDelete == null)
                return NotFound();

            if (!_achievementRepository.DeleteAchievement(achievementId))
            {
                ModelState.AddModelError("", $"Something went wrong deleting Achievement with Id {achievementId}");
                return StatusCode(500, ModelState);
            }

            return NoContent();
        }
    }
}