using WordleEvolved.Data;
using WordleEvolved.Interfaces;
using WordleEvolved.Models;

namespace WordleEvolved.Repository
{
    public class WordRepository : IWordRepository
    {

        private readonly DataContext _context;
        public WordRepository(DataContext context)
        {
            _context = context;
        }

        public Word GetWord(int id)
        {
            return _context.Words.Where(p => p.WordId == id).FirstOrDefault();
        }

        public Word GetWord(string word)
        {
            return _context.Words.Where(p => p.Value == word).FirstOrDefault();
        }

        public ICollection<Word> GetWords()
        {
            return _context.Words.OrderBy(p => p.WordId).ToList();
        }

        public bool WordExists(int id)
        {
            return _context.Words.Any(p => p.WordId == id);
        }

        public bool CreateWord(Word word)
        {
            _context.Add(word);

            return Save();
        }

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0 ? true : false;
        }

        public bool DeleteWord(int id)
        {
            var word = _context.Words.Find(id);
            if (word == null)
            {
                return false;
            }

            _context.Words.Remove(word);
            return Save();
        }

        public bool UpdateWord(Word word)
        {
            _context.Update(word);
            return Save();
        }
    }
}
