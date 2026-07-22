using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WordleEvolved.Dto;
using WordleEvolved.Interfaces;
using WordleEvolved.Models;
using WordleEvolved.Repository;

namespace WordleEvolved.Controllers
{
    //[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Route("/api/[controller]")]
    [ApiController]
    public class WordController: Controller
    {
        private readonly IWordRepository _wordRepository;
        private readonly IMapper _mapper;

        public WordController(IWordRepository wordRepository, IMapper mapper)
        {
            _wordRepository = wordRepository;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Word>))]
        public IActionResult GetWords()
        {
            var words = _mapper.Map<List<WordDto>>(_wordRepository.GetWords());

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(words);
        }

        [HttpGet("word/{wordValue}")]
        [ProducesResponseType(200, Type = typeof(int))]
        [ProducesResponseType(400)]
        public IActionResult GetWordId(string wordValue)
        {
            var words = _wordRepository.GetWords()
                .Where(a => a.Value.Trim().ToUpper() == wordValue.Trim().ToUpper())
                .ToList();

            if (words == null || words.Count < 1)
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // If there is more than one word, return the second. Otherwise, return the first.
            var wordId = words.Count >= 2 ? words[1].WordId : words[0].WordId;

            return Ok(wordId);
        }



        [HttpGet("{wordId}")]
        [ProducesResponseType(200, Type = typeof(Word))]
        [ProducesResponseType(400)]
        public IActionResult GetWord(int wordId)
        {
            if (!_wordRepository.WordExists(wordId))
                return NotFound();

            var word = _mapper.Map<WordDto>(_wordRepository.GetWord(wordId));

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(word);
        }

        [HttpGet("word/{wordValue}/{languageId}")]
        [ProducesResponseType(200, Type = typeof(int))]
        [ProducesResponseType(400)]
        public IActionResult GetWordIdByLanguage(string wordValue, int languageId)
        {
            var words = _wordRepository.GetWords()
                .Where(a => a.Value.Trim().ToUpper() == wordValue.Trim().ToUpper() && a.LanguageId == languageId)
                .ToList();

            if (words == null || words.Count < 1)
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // If there is more than one word, return the second. Otherwise, return the first.
            var wordId = words.Count >= 2 ? words[1].WordId : words[0].WordId;

            return Ok(wordId);
        }

        [HttpGet("random/{languageId}")]
        [ProducesResponseType(200, Type = typeof(Word))]
        [ProducesResponseType(400)]
        public IActionResult GetRandomWordByLanguage(int languageId)
        {
            var words = _wordRepository.GetWords()
                .Where(a => a.LanguageId == languageId)
                .ToList();

            if (words == null || words.Count < 1)
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Use System.Random to get a random index
            var random = new System.Random();
            var randomIndex = random.Next(words.Count);

            // Get the word at the random index
            var randomWord = words[randomIndex];

            return Ok(randomWord);
        }


        [HttpPost]
        //[Authorize(Roles = "admin,owner")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public IActionResult CreateWord([FromBody] WordDto wordCreate)
        {
            if (wordCreate == null)
                return BadRequest(ModelState);

            var word = _wordRepository.GetWords()
                .Where(a => a.Value.Trim().ToUpper() == wordCreate.Value.TrimEnd().ToUpper())
                .FirstOrDefault();

            if (word != null)
            {
                ModelState.AddModelError("", "Word already exists");
                return StatusCode(422, ModelState);
            }

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var wordMap = _mapper.Map<Word>(wordCreate);

            if (!_wordRepository.CreateWord(wordMap))
            {
                ModelState.AddModelError("", "something went wrong while saving");
                return StatusCode(500, ModelState);
            }

            return Ok("Successfully created");
        }

        [HttpPut("{wordId}")]
        //[Authorize(Roles = "admin,owner")]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public IActionResult UpdateWord(int wordId, [FromBody] WordDto updatedWord)
        {
            if (updatedWord == null)
                return BadRequest(ModelState);

            if (wordId != updatedWord.WordId)
                return BadRequest(ModelState);

            if (!_wordRepository.WordExists(wordId))
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest();

            var wordMap = _mapper.Map<Word>(updatedWord);

            if (!_wordRepository.UpdateWord(wordMap))
            {
                ModelState.AddModelError("", "something went wrong");
                return StatusCode(500, ModelState);
            }

            return NoContent();
        }

        [HttpDelete("{wordId}")]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public IActionResult DeleteWord(int wordId)
        {
            if (!_wordRepository.WordExists(wordId))
                return NotFound();

            var wordToDelete = _wordRepository.GetWord(wordId);
            if (wordToDelete == null)
                return NotFound();

            if (!_wordRepository.DeleteWord(wordId))
            {
                ModelState.AddModelError("", $"Something went wrong deleting Word with Id {wordId}");
                return StatusCode(500, ModelState);
            }

            return NoContent();
        }
    }
}
