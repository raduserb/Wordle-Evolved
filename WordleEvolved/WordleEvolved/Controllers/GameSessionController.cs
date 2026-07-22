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
    public class GameSessionController : Controller
    {
        private readonly IGameSessionRepository _gameSessionRepository;
        private readonly IUserRepository _userRepository;
        private readonly IWordRepository _wordRepository;
        private readonly IMapper _mapper;

        public GameSessionController(IGameSessionRepository gameSessionRepository, IUserRepository userRepository,
            IWordRepository wordRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _gameSessionRepository = gameSessionRepository;
            _wordRepository = wordRepository;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<GameSession>))]
        public IActionResult GetGameSessions()
        {
            var gameSesions = _mapper.Map<List<GameSessionDto>>(_gameSessionRepository.GetGameSessions());

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(gameSesions);
        }

        [HttpGet("{gameSessionId}")]
        [ProducesResponseType(200, Type = typeof(GameSession))]
        [ProducesResponseType(400)]
        public IActionResult GetGameSession(int gameSessionId)
        {
            if (!_gameSessionRepository.GameSessionExists(gameSessionId))
                return NotFound();

            var gameSession = _mapper.Map<GameSessionDto>(_gameSessionRepository.GetGameSession(gameSessionId));

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(gameSession);
        }

        [HttpGet("{gameSessionId}/word")]
        [ProducesResponseType(200, Type = typeof(Word))]
        [ProducesResponseType(400)]
        public IActionResult GetWordByGameSessionId(int gameSessionId)
        {
            var word = _mapper.Map<WordDto>(_gameSessionRepository.GetWordByGameSessionId(gameSessionId));

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(word);
        }


        [HttpPost("{userId}/{languageId}")]
        [ProducesResponseType(201)]
        [ProducesResponseType(400)]
        public IActionResult CreateGameSession(int userId, int languageId)
        {
            // Check if the user exists
            var user = _userRepository.GetUser(userId);
            if (user == null)
            {
                return NotFound("User not found");
            }

            // Get all words
            var words = _wordRepository.GetWords().Where(w => w.LanguageId == languageId).ToList();
            if (words == null || words.Count == 0)
            {
                return BadRequest("No words available");
            }

            // Pick a random word
            var random = new Random();

            // Create a new game session

            var gameSession = new GameSession
            {
                LanguageId = languageId,
                NrGuesses = 0,
                Result = "In Progress",
                Word = words.ToList()[random.Next(words.Count)],
                User = user
            };


            _gameSessionRepository.CreateGameSession(gameSession);


            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(gameSession);
        }

        [HttpPost("{userId}/{wordId}/{languageId}/{nrGuesses}/{result}")]
        [ProducesResponseType(201)]
        [ProducesResponseType(400)]
        public IActionResult CreateGameSessionWithSpecificWord(int userId, int wordId, int languageId, int nrGuesses, string result)
        {
            // Check if the user exists
            var user = _userRepository.GetUser(userId);
            if (user == null)
            {
                return NotFound("User not found");
            }

            // Get the word 
            var word = _wordRepository.GetWord(wordId);
            if (word == null)
            {
                return BadRequest("Word not found");
            }

            // Create a new game session
            var gameSession = new GameSession
            {
                LanguageId = languageId,
                NrGuesses = nrGuesses,
                Result = result,
                Word = word,
                User = user
            };

            _gameSessionRepository.CreateGameSession(gameSession);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(gameSession);
        }

        [HttpPut("{gameSessionId}")]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public IActionResult UpdateGameSesion(int gameSessionId, [FromBody] GameSessionDto updatedGameSession)
        {
            if (updatedGameSession == null)
                return BadRequest(ModelState);

            if (gameSessionId != updatedGameSession.GameSessionId)
                return BadRequest(ModelState);

            if (!_gameSessionRepository.GameSessionExists(gameSessionId))
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest();

            var gameSessionMap = _mapper.Map<GameSession>(updatedGameSession);

            if (!_gameSessionRepository.UpdateGameSession(gameSessionMap))
            {
                ModelState.AddModelError("", "something went wrong");
                return StatusCode(500, ModelState);
            }

            return NoContent();
        }

        [HttpDelete("{gameSessionId}")]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public IActionResult DeleteGameSession(int gameSessionId)
        {
            if (!_gameSessionRepository.GameSessionExists(gameSessionId))
                return NotFound();

            var gameSessionToDelete = _gameSessionRepository.GetGameSession(gameSessionId);
            if (gameSessionToDelete == null)
                return NotFound();

            if (!_gameSessionRepository.DeleteGameSession(gameSessionId))
            {
                ModelState.AddModelError("", $"Something went wrong deleting Game Session with Id {gameSessionId}");
                return StatusCode(500, ModelState);
            }

            return NoContent();
        }

        [HttpGet("user/{userId}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<GameSession>))]
        [ProducesResponseType(400)]
        public IActionResult GetGameSessionsByUserId(int userId)
        {
            var gameSessions = _mapper.Map<List<GameSessionDto>>(_gameSessionRepository.GetGameSessionsByUserId(userId));

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(gameSessions);
        }



    }
}