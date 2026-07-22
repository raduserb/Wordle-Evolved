using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using WordleEvolved.Dto;
using WordleEvolved.Interfaces;
using WordleEvolved.Models;
using WordleEvolved.Repository;

namespace WordleEvolved.Controllers
{
    [Route("/api/[controller]")]
    [ApiController]
    public class UserStatisticsController : Controller
    {
        private readonly IUserStatisticsRepository _userStatisticsRepository;
        private readonly IMapper _mapper;

        public UserStatisticsController(IUserStatisticsRepository userStatisticsRepository, IMapper mapper)
        {
            _userStatisticsRepository = userStatisticsRepository;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<UserStatistics>))]
        public IActionResult GetAllUserStatistics()
        {
            var userStatistics = _mapper.Map<List<UserStatisticsDto>>(_userStatisticsRepository.GetAllUserStatistics());

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(userStatistics);
        }

        [HttpGet("{statisticId}")]
        [ProducesResponseType(200, Type = typeof(UserStatistics))]
        [ProducesResponseType(400)]
        public IActionResult GetUserStatistics(int statisticId)
        {
            if (!_userStatisticsRepository.UserStatisticsExist(statisticId))
                return NotFound();

            var userStatistics = _mapper.Map<UserStatisticsDto>(_userStatisticsRepository.GetUserStatistics(statisticId));

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(userStatistics);
        }

        [HttpGet("user/{userId}")]
        [ProducesResponseType(200, Type = typeof(UserStatistics))]
        [ProducesResponseType(400)]
        public IActionResult GetUserStatisticsByUserId(int userId)
        {
            var userStatistics = _mapper.Map<UserStatisticsDto>(_userStatisticsRepository.GetUserStatisticsByUserId(userId));

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(userStatistics);
        }

        [HttpPut("{userStatisticsId}")]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public IActionResult UpdateUserStatistics(int userStatisticsId, [FromBody] UserStatisticsDto updatedUserStatistics)
        {
            if (updatedUserStatistics == null)
                return BadRequest(ModelState);

            if (userStatisticsId != updatedUserStatistics.StatisticId)
                return BadRequest(ModelState);

            if (!_userStatisticsRepository.UserStatisticsExist(userStatisticsId))
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest();

            var userStatisicsMap = _mapper.Map<UserStatistics>(updatedUserStatistics);

            if (!_userStatisticsRepository.UpdateUserStatistics(userStatisicsMap))
            {
                ModelState.AddModelError("", "something went wrong");
                return StatusCode(500, ModelState);
            }

            return NoContent();
        }

        [HttpPut("increment/{userStatisticsId}")]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public IActionResult IncrementUserStatistics(int userStatisticsId, [FromBody] bool isWin)
        {
            if (!_userStatisticsRepository.UserStatisticsExist(userStatisticsId))
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest();

            var userStatistics = _userStatisticsRepository.GetUserStatistics(userStatisticsId);
            userStatistics.GamesPlayed += 1;
            if (isWin)
            {
                userStatistics.Wins += 1;
            }
            else
            {
                userStatistics.Losses += 1;
            }

            if (!_userStatisticsRepository.UpdateUserStatistics(userStatistics))
            {
                ModelState.AddModelError("", "something went wrong");
                return StatusCode(500, ModelState);
            }

            return NoContent();
        }



        [HttpDelete("{userStatisticsId}")]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public IActionResult DeleteUserStatistics(int userStatisticsId)
        {
            if (!_userStatisticsRepository.UserStatisticsExist(userStatisticsId))
                return NotFound();

            var userStaisticsToDelete = _userStatisticsRepository.GetUserStatistics(userStatisticsId);
            if (userStaisticsToDelete == null)
                return NotFound();

            if (!_userStatisticsRepository.DeleteUserStatistics(userStatisticsId))
            {
                ModelState.AddModelError("", $"Something went wrong deleting User Statistics with Id {userStatisticsId}");
                return StatusCode(500, ModelState);
            }

            return NoContent();
        }

    }
}